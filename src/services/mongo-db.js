import { MongoClient } from "mongodb";
import md5 from "md5";

import {
    MONGODB_URL,
    ACTIVITIES_COLLECTION,
    PROCESSED_ACTIVITIES_COLLECTION,
    CLUBS_COLLECTION
} from "../config";

let dbInstance;

export function getActivityId(activity) {
    return md5(
        `${activity.athlete.firstname}-${activity.athlete.lastname}-${
            activity.distance
        }-${activity.elapsed_time}-${activity.moving_time}-${activity.name}-${
            activity.total_elevation_gain
        }-${activity.type}`
    );
}

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

export async function insertActivities(activities = []) {
    if (activities.length > 0) {
        const db = await getMongoClient();
        await db.collection(ACTIVITIES_COLLECTION).insertMany(
            activities.map(x => {
                return {
                    _id: getActivityId(x),
                    computed: false,
                    ...x
                };
            })
        );
    }
}
