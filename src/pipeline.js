import { map } from "bluebird";

import { log } from "./services/logger";
import { upsertActivity, retrieveAthlete } from "./services/mongo-db";
import { getActivity } from "./services/strava";

export default async function pipeline(event, context, callback) {
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
        }

        const parsed = JSON.parse(body);
        log.debug({ parsed });

        const activity = await getActivity({ id: parsed.object_id });
        log.debug({ activity });

        const athlete = await retrieveAthlete(activity.athlete.id);
        log.debug({ athlete });

        await map(athlete.clubs || [], async club => {
            await upsertActivity({
                ...activity,
                athlete,
                club
            });
        });

        context.succeed();
    } catch (error) {
        log.debug({ error });
        context.fail();
    }
}
