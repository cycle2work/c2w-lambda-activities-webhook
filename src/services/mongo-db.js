import { MongoClient } from "mongodb";

import { MONGODB_URL, ACTIVITIES_COLLECTION, ATHLETES_COLLECTION } from "../config";

let dbInstance;

export async function getMongoClient() {
    if (!dbInstance) {
        dbInstance = await MongoClient.connect(MONGODB_URL);
    }
    return dbInstance;
}

export async function retrieveAthlete(athleteId) {
    const db = await getMongoClient();
    return await db.collection(ATHLETES_COLLECTION).findOne({ id: athleteId });
}

export async function upsertActivity(activity) {
    if (activity) {
        const db = await getMongoClient();
        await db.collection(ACTIVITIES_COLLECTION).update({ _id: activity._id }, activity, { upsert: true });
    }
}
