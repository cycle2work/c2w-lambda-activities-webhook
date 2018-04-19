export const mockedClub1 = {
    _id: 1,
    id: 1
};

export const mockedClub2 = {
    _id: 2,
    id: 2
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
