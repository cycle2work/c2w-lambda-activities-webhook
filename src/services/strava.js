import strava from "strava-v3";

export const getActivity = (...args) => strava.activities.get(...args);
export const refreshToken = (...args) => strava.oauth.refreshToken(...args);
