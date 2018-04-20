import dotenv from "dotenv";

dotenv.load();

export const LOG_LEVEL = process.env.LOG_LEVEL || "debug";
export const STRAVA_WEBHOOKS_URL = process.env.STRAVA_WEBHOOKS_URL || "https://api.strava.com/api/v3/push_subscriptions";
export const STRAVA_ACCESS_TOKEN = process.env.STRAVA_ACCESS_TOKEN;
export const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
export const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
export const STRAVA_REDIRECT_URI = process.env.STRAVA_REDIRECT_URI;
export const STRAVA_CODE_TEST = process.env.STRAVA_CODE_TEST;
export const ACTIVITIES_COLLECTION = process.env.ACTIVITIES_COLLECTION || "activities";
export const CLUBS_COLLECTION = process.env.CLUBS_COLLECTION || "clubs";
export const ATHLETES_COLLECTION = process.env.CLUBS_COLLECTION || "users";
export const PROCESSED_ACTIVITIES_COLLECTION = process.env.PROCESSED_ACTIVITIES_COLLECTION || "processed-activities";
export const MONGODB_URL = process.env.NODE_ENV !== "test" ? process.env.MONGODB_URL : "mongodb://localhost:27017/test";
