import chai, { expect } from "chai";
import nock from "nock";
import { spy } from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import { handler } from "index";
import { ACTIVITIES_COLLECTION } from "config";

import { mockedActivity } from "./mocks/strava";

import { getMongoClient } from "services/mongo-db";
import { ATHLETES_COLLECTION } from "../src/config";

nock("https://www.strava.com", { encodedQueryParams: true })
    .get(`/api/v3/activities/${mockedActivity.id}?`)
    .times(3)
    .reply(200, () => mockedActivity);

describe("Cycle2work activities function", () => {
    let db;
    let context;
    let callback = spy();

    before(async () => {
        db = await getMongoClient();
        await db.createCollection(ACTIVITIES_COLLECTION);
        await db.createCollection(ATHLETES_COLLECTION);
        await db.collection(ATHLETES_COLLECTION).insert({
            id: mockedActivity.athlete.id,
            clubs: [
                {
                    id: 1,
                    name: "clubaname1"
                },
                {
                    id: 2,
                    name: "clubaname2"
                }
            ]
        });
    });

    after(async () => {
        await db.dropCollection(ACTIVITIES_COLLECTION);
        await db.dropCollection(ATHLETES_COLLECTION);
        await db.close();
    });

    beforeEach(() => {
        context = {
            succeed: spy(),
            fail: spy()
        };
        callback.reset();
    });

    it("echo for webhook pub/sub", async () => {
        await handler(
            {
                httpMethod: "GET",
                queryStringParameters: {
                    "hub.challenge": "hub.challenge"
                },
                body: null
            },
            context,
            callback
        );

        expect(callback).to.have.been.calledOnce;
        expect(callback).to.have.been.calledWith(null, {
            statusCode: 200,
            body: JSON.stringify({
                "hub.challenge": "hub.challenge"
            })
        });
    });

    it("receive and upsert activity", async () => {
        await handler(
            {
                httpMethod: "POST",
                body: `{"object_id": ${mockedActivity.id}, "owner_id": ${mockedActivity.athlete.id}}`
            },
            context,
            callback
        );

        await handler(
            {
                httpMethod: "POST",
                body: `{"object_id": ${mockedActivity.id}, "owner_id": ${mockedActivity.athlete.id}}`
            },
            context,
            callback
        );

        expect(context.succeed).to.have.been.calledTwice;

        const activities = await db
            .collection(ACTIVITIES_COLLECTION)
            .find({})
            .toArray();

        expect(activities.length).to.be.equal(2);

        expect(activities.find(x => x.club.id === 1)).to.not.be.equal(undefined);
        expect(activities.find(x => x.club.id === 2)).to.not.be.equal(undefined);
        expect(activities.find(x => x.club.id === 3)).to.be.equal(undefined);

        activities.forEach(x => {
            expect(x.name).to.equal("#cycle2work yo!");
            expect(x.athlete.id).to.equal(134815);
            expect(x.month).to.equal(2);
            expect(x.year).to.equal("2018");
        });
    });
});
