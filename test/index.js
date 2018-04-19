import chai, { expect } from "chai";
import nock from "nock";
import { spy } from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import { handler } from "index";
import { CLUBS_COLLECTION, ACTIVITIES_COLLECTION } from "config";

import { mockedClub1, mockedClub2, listClubActivities } from "./mocks/strava";

import { getMongoClient } from "services/mongo-db";

nock("https://www.strava.com", { encodedQueryParams: true })
    .get(`/api/v3/clubs/${mockedClub1.id}/activities?per_page=50`)
    .times(3)
    .reply(200, listClubActivities());

nock("https://www.strava.com", { encodedQueryParams: true })
    .get(`/api/v3/clubs/${mockedClub2.id}/activities?per_page=50`)
    .times(3)
    .reply(200, () => []);

describe("`Cycle2work activities function`", () => {
    let db;
    let context;

    before(async () => {
        db = await getMongoClient();
        await db.createCollection(CLUBS_COLLECTION);
        await db.createCollection(ACTIVITIES_COLLECTION);
        await db.collection(CLUBS_COLLECTION).insert(mockedClub1);
        await db.collection(CLUBS_COLLECTION).insert(mockedClub2);
    });

    after(async () => {
        await db.dropCollection(CLUBS_COLLECTION);
        await db.dropCollection(ACTIVITIES_COLLECTION);
        await db.close();
    });

    beforeEach(() => {
        context = {
            succeed: spy()
        };
    });

    it("scrape and save for new clubs activities", async () => {
        await handler(null, context);

        expect(context.succeed).to.have.been.calledOnce;

        const activities = await db
            .collection(ACTIVITIES_COLLECTION)
            .find({})
            .toArray();
        expect(activities.length).to.be.equal(3);
    });

    it("scrape and ignore for already saved clubs activities", async () => {
        await handler(null, context);

        expect(context.succeed).to.have.been.calledOnce;

        const activities = await db
            .collection(ACTIVITIES_COLLECTION)
            .find({})
            .toArray();
        expect(activities.length).to.be.equal(3);
    });
});
