import { map } from "bluebird";

import { log } from "./services/logger";
import { upsertActivity, retrieveAthlete } from "./services/mongo-db";
import { getActivity } from "./services/strava";

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
            const activity = await getActivity({
                access_token: athlete.access_token,
                id: parsed.object_id
            });
            log.debug({ activity });

            if (activity.commute || /#cycle2work/.test(activity.name)) {
                await map(athlete.clubs || [], async club => {
                    await upsertActivity({
                        _id: `${activity.id}${club.id}`,
                        ...activity,
                        athlete,
                        club
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
