import includes from "lodash.includes";
import uniq from "lodash.uniq";

import { log } from "./services/logger";
import { retrieveClubs, insertActivities, retrieveActivities, retrieveProcessedActivities } from "./services/mongo-db";
import { listClubActivities } from "./services/strava";

export default async function pipeline(event, context) {

    try {

        const clubs = await retrieveClubs();
        log.debug({ clubs });

        const savedActivities = await retrieveActivities();
        log.debug({ savedActivities });

        const processedActivities = await retrieveProcessedActivities();
        log.debug({ processedActivities });

        const totalActivities = [...processedActivities, ...savedActivities];

        const activies = uniq(await clubs.reduce(async (state, club) => {
            const clubActivies = await listClubActivities({
                access_token: club.access_token,
                id: club.id,
                per_page: 200
            }).map(activity => {
                return {
                    ...activity,
                    club: club
                };
            });
            return [...state, ...clubActivies.filter(x => x.commute && !includes(totalActivities.map(x => x.id), x.id))];
        }, []));

        log.debug({ activies });

        await insertActivities(activies);

        context.succeed();

    } catch (error) {
        log.debug({ error });
        context.fail();
    }
}
