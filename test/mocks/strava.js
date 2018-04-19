export const mockedClubId = 80327326;

export const mockedClub = {
    _id: mockedClubId,
    id: mockedClubId,
    resource_state: 2,
    name: "Team Strava Cycling",
    profile_medium: "http://pics.com/clubs/1/medium.jpg",
    profile: "http://pics.com/clubs/1/large.jpg",
    cover_photo: "http://pics.com/clubs/1/cover/large.jpg",
    cover_photo_small: "http://pics.com/clubs/1/cover/small.jpg",
    sport_type: "cycling",
    city: "San Francisco",
    state: "California",
    country: "United States",
    private: true,
    member_count: 23,
    featured: false,
    verified: false,
    url: "strava-cycling"
};

export function listClubActivities() {
    return [
        {
            athlete: {
                firstname: "Davide",
                lastname: "M."
            },
            distance: 12816.0,
            elapsed_time: 3327,
            moving_time: 3150,
            name: "Strade Bianche Grand Fondo, Section 3 - FulGaz"
        },
        {
            athlete: {
                firstname: "Manuel",
                lastname: "S."
            },
            distance: 15280.9,
            elapsed_time: 2155,
            moving_time: 2142,
            name: "#cycle2work #1.2"
        },
        {
            athlete: {
                firstname: "Matteo",
                lastname: "G."
            },
            distance: 15848.7,
            elapsed_time: 5755,
            moving_time: 4887,
            name: "DOMS come se piovesse"
        },
        {
            athlete: {
                firstname: "michele",
                lastname: "M."
            },
            distance: 33102.0,
            elapsed_time: 10104,
            moving_time: 8374,
            name: "Colmo oltre misura",
            commute: true
        },
        {
            athlete: {
                firstname: "Manuel",
                lastname: "S."
            },
            distance: 15276.8,
            elapsed_time: 2277,
            moving_time: 2258,
            name: "#cycle2work #1"
        }
    ];
}
