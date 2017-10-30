import includes from "lodash.includes";
import uniq from "lodash.uniq";

import { log } from "./services/logger";
import { retrieveUsers, insertActivities, retrieveActivities, retrieveProcessedActivities } from "./services/mongo-db";
import { listAthleteClubs, listClubActivities } from "./services/strava";

export default async function pipeline(event, context) {

    try {

        const users = await retrieveUsers();

        log.debug({ users });

        const clubs = uniq(await users.reduce(async (state, user) => {
            const userClubs = await listAthleteClubs({ access_token: user.access_token }).map(club => {
                return { ...club, access_token: user.access_token };
            });
            return [...state, ...userClubs];
        }, []));

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
            });
            return [...state, ...clubActivies.filter(x => x.commute && !includes(totalActivities.map(x => x.id), x.id))];
        }, []));

        log.debug({ activies });

        await insertActivities(activies);

    } catch (error) {
        log.debug({ error });
    }

    context.succeed();

}
