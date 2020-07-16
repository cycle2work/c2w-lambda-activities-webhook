import { map } from "bluebird";
import moment from "moment";

import { log } from "./services/logger";
import { upsertActivity, retrieveAthlete, updateAthleteToken, upsertProcessedActivity} from "./services/mongo-db";
import { getActivity, refreshToken } from "./services/strava";

export default async function pipeline(event, context, callback) {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        log.debug({ event });

        const { body, httpMethod, queryStringParameters } = event;
        log.debug({ body, httpMethod, queryStringParameters });

        if (httpMethod === "GET") {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    "hub.challenge": queryStringParameters["hub.challenge"]
                })
            });
            return;
        }

        const parsed = JSON.parse(body);
        log.debug({ parsed });

        const athlete = await retrieveAthlete(parsed.owner_id);
        log.debug({ athlete });

        if (athlete) {
            if (athlete.expires_at <= moment.utc().unix()) {
                log.debug("Refreshing token");
                const { access_token, refresh_token, expires_at } = await refreshToken(athlete.refresh_token);
                await updateAthleteToken(parsed.owner_id, access_token, refresh_token, expires_at);

                athlete.access_token = access_token;
            }

            const activity = await getActivity({
                access_token: athlete.access_token,
                id: parsed.object_id
            });
            log.debug({ activity });

            if (activity.commute || /#cycle2work/.test(activity.name)) {
                const date = moment.utc(activity.start_date);
                await map(athlete.clubs || [], async club => {
                    await upsertActivity({
                        _id: `${activity.id}${club.id}`,
                        ...activity,
                        athlete,
                        club,
                        year: date.format("YYYY"),
                        month: parseInt(date.format("MM")),
                        day: date.format("DD")
                    });

                    await upsertProcessedActivity({
                        _id: `${activity.id}${club.id}`,
                        activityId: activity.id,
                        athleteId: athlete.id,
                        athleteName: `${athlete.firstName} ${athlete.lastname}`,
                        clubId: club.id,
                        year: parseInt(date.format("YYYY")),
                        month: parseInt(date.format("MM")),
                        day: parseInt(date.format("DD"))
                    });
                });
            }
        }

        callback(null, {
            statusCode: 200,
            body: null
        });

        context.succeed();
    } catch (error) {
        log.fatal({ error });
        context.fail();
    }
}
