import { map } from "bluebird";

import { log } from "./services/logger";
import { upsertActivity, retrieveAthlete } from "./services/mongo-db";
import { getActivity } from "./services/strava";

export default async function pipeline(event, context) {
    try {
        log.debug({ event });

        const { body } = event;
        log.debug({ body });

        const parsed = JSON.parse(body);
        log.debug({ parsed });

        const activity = await getActivity({ id: parsed.object_id });
        log.debug({
            activity: {
                id: activity.id,
                name: activity.name,
                athlete: activity.athlete
            }
        });

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
