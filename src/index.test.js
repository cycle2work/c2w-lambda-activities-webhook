import { handler } from ".";
import { ACTIVITIES_COLLECTION, ATHLETES_COLLECTION, DB_NAME } from "./config";

import { mockedActivity, mockedRefreshTokenResponse } from "./mocks/strava";
import * as strava from "./services/strava";

import { getMongoClient } from "./services/mongo-db";
import { Promise } from "bluebird";
import moment from "moment";

strava.getActivity = jest.fn(() => {
    return new Promise((resolve) => resolve(mockedActivity));
});

strava.refreshToken = jest.fn(() => {
    return new Promise((resolve) => resolve(mockedRefreshTokenResponse));
});

describe("Cycle2work activities function", () => {
    let client;
    let context;
    let callback = jest.fn();

    beforeAll(async () => {
        client = await getMongoClient();
        await client.db(DB_NAME).collection(ACTIVITIES_COLLECTION).deleteMany({});
        await client.db(DB_NAME).collection(ATHLETES_COLLECTION).deleteMany({});

        await client
            .db(DB_NAME)
            .collection(ATHLETES_COLLECTION)
            .insertOne({
                id: mockedActivity.athlete.id,
                expires_at: moment.utc().unix() + 1000,
                access_token: "access_token",
                refresh_token: "refresh_token",
                clubs: [
                    {
                        id: 1,
                        name: "clubaname1",
                    },
                    {
                        id: 2,
                        name: "clubaname2",
                    },
                ],
            });
    });

    afterAll(async () => {
        client.close();
    });

    beforeEach(() => {
        context = {
            succeed: jest.fn(),
            fail: jest.fn(),
        };
        callback = jest.fn();
    });

    it("echo for webhook pub/sub", async () => {
        client = await getMongoClient();

        await handler(
            {
                httpMethod: "GET",
                queryStringParameters: {
                    "hub.challenge": "hub.challenge",
                },
                body: null,
            },
            context,
            callback
        );

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(null, {
            statusCode: 200,
            body: JSON.stringify({
                "hub.challenge": "hub.challenge",
            }),
        });
    });

    it("receive and upsert activity", async () => {
        await handler(
            {
                httpMethod: "POST",
                body: `{"object_id": ${mockedActivity.id}, "owner_id": ${mockedActivity.athlete.id}}`,
            },
            context,
            callback
        );

        await handler(
            {
                httpMethod: "POST",
                body: `{"object_id": ${mockedActivity.id}, "owner_id": ${mockedActivity.athlete.id}}`,
            },
            context,
            callback
        );

        expect(context.succeed).toHaveBeenCalledTimes(2);

        const activities = await client.db(DB_NAME).collection(ACTIVITIES_COLLECTION).find({}).toArray();

        expect(activities.length).toBe(2);

        expect(activities.find((x) => x.club.id === 1)).toBeDefined();
        expect(activities.find((x) => x.club.id === 2)).toBeDefined();

        expect(strava.refreshToken).toHaveBeenCalledTimes(0);
        expect(strava.getActivity).toHaveBeenCalledWith({ access_token: "access_token", id: mockedActivity.id });

        activities.forEach((x) => {
            expect(x.name).toBe("#cycle2work yo!");
            expect(x.athlete.id).toBe(134815);
            expect(x.month).toBe(2);
            expect(x.year).toBe("2018");
        });
    });

    it("refresh token if expired", async () => {
        await client
            .db(DB_NAME)
            .collection(ATHLETES_COLLECTION)
            .updateOne(
                { id: mockedActivity.athlete.id },
                {
                    $set: { expires_at: 0 },
                }
            );

        await handler(
            {
                httpMethod: "POST",
                body: `{"object_id": ${mockedActivity.id}, "owner_id": ${mockedActivity.athlete.id}}`,
            },
            context,
            callback
        );

        const athlete = await client.db(DB_NAME).collection(ATHLETES_COLLECTION).findOne({ id: mockedActivity.athlete.id });

        expect(context.succeed).toHaveBeenCalledTimes(1);
        expect(strava.refreshToken).toHaveBeenCalledWith("refresh_token");
        expect(strava.getActivity).toHaveBeenCalledWith({ access_token: mockedRefreshTokenResponse.access_token, id: mockedActivity.id });
        expect(athlete).toMatchObject(mockedRefreshTokenResponse);
    });
});
