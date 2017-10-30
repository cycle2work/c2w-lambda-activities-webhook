import chai, { expect } from "chai";
import nock from "nock";
import { spy } from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import { handler } from "index";
import {
    USERS_COLLECTION,
    ACTIVITIES_COLLECTION
} from "config";

import {
    athlete,
    clubId,
    listAthleteClubs,
    listClubActivities,
} from "./mocks/strava";

import { getMongoClient } from "services/mongo-db";

nock("https://www.strava.com", { "encodedQueryParams": true })
    .get("/api/v3/athlete/clubs?")
    .times(3)
    .reply(200, listAthleteClubs())
    .get(`/api/v3/clubs/${clubId}/activities?per_page=200`)
    .times(3)
    .reply(200, listClubActivities());

describe("`Cycle2work activities function`", () => {

    let db;
    let context;
    let callback;

    before(async () => {
        db = await getMongoClient();
        await db.createCollection(USERS_COLLECTION);
        await db.createCollection(ACTIVITIES_COLLECTION);
        await db.collection(USERS_COLLECTION).insert(athlete);
    });

    after(async () => {
        await db.dropCollection(USERS_COLLECTION);
        await db.dropCollection(ACTIVITIES_COLLECTION);
        await db.close();
    });

    beforeEach(() => {
        context = {
            succeed: spy()
        };
        callback = spy();
    });


    it("scrape and save for new clubs activities", async () => {
        await handler(null, context, callback);

        expect(context.succeed).to.have.been.calledOnce;

        const activities = await db.collection(ACTIVITIES_COLLECTION).find({}).toArray();
        expect(activities.length).to.be.equal(1);
    });

    it("scrape and ignore for already saved clubs activities", async () => {
        await handler(null, context, callback);

        expect(context.succeed).to.have.been.calledOnce;

        const activities = await db.collection(ACTIVITIES_COLLECTION).find({}).toArray();
        expect(activities.length).to.be.equal(1);
    });

});
