export const LOG_LEVEL = process.env.LOG_LEVEL || "debug";
export const STRAVA_ACCESS_TOKEN = process.env.STRAVA_ACCESS_TOKEN;
export const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
export const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
export const ACTIVITIES_COLLECTION = process.env.ACTIVITIES_COLLECTION || "activities";
export const ATHLETES_COLLECTION = process.env.ATHLETES_COLLECTION || "users";
export const PROCESSED_ACTIVITIES_COLLECTION = process.env.PROCESSED_ACTIVITIES_COLLECTION || "processed-activities";
export const MONGODB_URL = process.env.NODE_ENV !== "test" ? process.env.MONGODB_URL : "mongodb://localhost:27017/c2w-mongol";
export const DB_NAME = process.env.DB_NAME || "c2w-mongol";
