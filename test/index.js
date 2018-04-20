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
            id: 134815,
            clubs: [
                {
                    id: 1,
                    name: "clubaname"
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
            succeed: spy()
        };
        callback.reset();
    });

    it("receive and upsert activity", async () => {
        await handler(
            {
                body: `{"object_id": ${mockedActivity.id}}`
            },
            context,
            callback
        );

        await handler(
            {
                body: `{"object_id": ${mockedActivity.id}}`
            },
            context,
            callback
        );

        expect(context.succeed).to.have.been.calledTwice;

        const activities = await db
            .collection(ACTIVITIES_COLLECTION)
            .find({})
            .toArray();

        expect(activities.length).to.be.equal(1);

        activities.forEach(x => {
            expect(x.name).to.equal("Happy Friday");
            expect(x.athlete.id).to.equal(134815);
        });
    });
});
