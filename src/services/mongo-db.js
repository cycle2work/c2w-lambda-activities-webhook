import { MongoClient } from "mongodb";

import { MONGODB_URL, ACTIVITIES_COLLECTION, ATHLETES_COLLECTION, DB_NAME, PROCESSED_ACTIVITIES_COLLECTION } from "../config";

let clientInstance;

export async function getMongoClient() {
    if (!clientInstance) {
        clientInstance = await MongoClient.connect(MONGODB_URL, { useUnifiedTopology: true });
    }
    return clientInstance.db(DB_NAME);
}

export async function retrieveAthlete(athleteId) {
    const client = await getMongoClient();
    return await client.collection(ATHLETES_COLLECTION).findOne({ id: athleteId });
}

export async function updateAthleteToken(athleteId, access_token, refresh_token, expires_at) {
    const client = await getMongoClient();
    await client.collection(ATHLETES_COLLECTION).updateOne({ id: athleteId }, { $set: { access_token, refresh_token, expires_at } });
}

export async function upsertActivity(activity) {
    const client = await getMongoClient();
    await client.collection(ACTIVITIES_COLLECTION).replaceOne({ _id: activity._id }, activity, { upsert: true });
}

export async function upsertProcessedActivity(activity) {
    const client = await getMongoClient();
    await client.collection(PROCESSED_ACTIVITIES_COLLECTION).replaceOne({ _id: activity._id }, activity, { upsert: true });
}
