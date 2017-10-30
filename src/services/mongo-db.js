import { MongoClient } from "mongodb";

import {
    MONGODB_URL,
    USERS_COLLECTION,
    ACTIVITIES_COLLECTION,
    PROCESSED_ACTIVITIES_COLLECTION
} from "../config";

let dbInstance;

export async function getMongoClient() {
    if (!dbInstance) {
        dbInstance = await MongoClient.connect(MONGODB_URL);
    }
    return dbInstance;
}

export async function retrieveUsers(query = {}) {
    const db = await getMongoClient();
    return await db.collection(USERS_COLLECTION).find(query).toArray();
}

export async function retrieveActivities(query = {}) {
    const db = await getMongoClient();
    return await db.collection(ACTIVITIES_COLLECTION).find(query).toArray();
}

export async function retrieveProcessedActivities(query = {}) {
    const db = await getMongoClient();
    return await db.collection(PROCESSED_ACTIVITIES_COLLECTION).find(query).toArray();
}

export async function insertActivities(activities = []) {
    if (activities.length > 0) {
        const db = await getMongoClient();
        await db.collection(ACTIVITIES_COLLECTION).insertMany(activities.map(x => {
            return {
                _id: x.id,
                computed: false,
                ...x
            };
        }));
    }
}
