import strava from "strava-v3";

import { promisify } from "bluebird";

export const getActivity = promisify(strava.activities.get);
