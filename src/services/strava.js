import strava from "strava-v3";

import { promisify } from "bluebird";

export const listAthleteClubs = promisify(strava.athlete.listClubs);
export const listClubActivities = promisify(strava.clubs.listActivities);
export const getActivity = promisify(strava.activities.get);
