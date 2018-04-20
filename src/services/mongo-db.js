import { MongoClient } from "mongodb";

import {
    MONGODB_URL,
    ACTIVITIES_COLLECTION,
    PROCESSED_ACTIVITIES_COLLECTION,
    ATHLETES_COLLECTION,
    CLUBS_COLLECTION
} from "../config";

let dbInstance;

export async function getMongoClient() {
    if (!dbInstance) {
        dbInstance = await MongoClient.connect(MONGODB_URL);
    }
    return dbInstance;
}

export async function retrieveClubs(query = {}) {
    const db = await getMongoClient();
    return await db
        .collection(CLUBS_COLLECTION)
        .find(query)
        .toArray();
}

export async function retrieveActivities(query = {}) {
    const db = await getMongoClient();
    return await db
        .collection(ACTIVITIES_COLLECTION)
        .find(query)
        .toArray();
}

export async function retrieveProcessedActivities(query = {}) {
    const db = await getMongoClient();
    return await db
        .collection(PROCESSED_ACTIVITIES_COLLECTION)
        .find(query)
        .toArray();
}

export async function retrieveAthlete(athleteId) {
    const db = await getMongoClient();
    return await db.collection(ATHLETES_COLLECTION).findOne({ id: athleteId });
}

export async function upsertActivity(activity) {
    if (activity) {
        const db = await getMongoClient();
        await db.collection(ACTIVITIES_COLLECTION).update({ id: activity.id }, activity, { upsert: true });
    }
}
