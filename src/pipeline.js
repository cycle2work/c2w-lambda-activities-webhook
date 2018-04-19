import includes from "lodash.includes";
import uniq from "lodash.uniq";

import { log } from "./services/logger";
import {
    getActivityId,
    insertActivities,
    retrieveActivities,
    retrieveClubs,
    retrieveProcessedActivities
} from "./services/mongo-db";
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

        const activitiesIds = totalActivities.map(x => x._id).filter(x => x);
        log.debug({ activitiesIds });

        const activies = uniq(
            await clubs.reduce(async (state, club) => {
                const clubActivies = await listClubActivities({
                    access_token: club.access_token,
                    id: club.id,
                    per_page: 50
                }).map(activity => {
                    return {
                        ...activity,
                        club: club
                    };
                });

                log.debug({ clubActivies });
                return [
                    ...state,
                    ...clubActivies.filter(
                        x =>
                            (x.commute || /#cycle2work/.test(x.name)) &&
                            !includes(activitiesIds, getActivityId(x))
                    )
                ];
            }, [])
        );

        log.info({ activies });

        await insertActivities(activies);

        context.succeed();
    } catch (error) {
        log.debug({ error });
        context.fail();
    }
}
