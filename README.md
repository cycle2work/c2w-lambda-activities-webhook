# c2w-lambda-activities

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/cycle2work/c2w-lambda-activities.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/cycle2work/c2w-lambda-activities/context:javascript)
[![Build Status](https://travis-ci.org/cycle2work/c2w-lambda-activities.svg?branch=master)](https://travis-ci.org/cycle2work/c2w-lambda-activities)
[![codecov](https://codecov.io/gh/cycle2work/c2w-lambda-activities/branch/master/graph/badge.svg)](https://codecov.io/gh/cycle2work/c2w-lambda-activities)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

AWS Lambda function to persist user activities data to enjoy [`cycle2work`](https://cycle2work.io).

After cloning the repository, run `npm install` or [`yarn`](https://yarnpkg.com) to install all dependencies and `yarn dev` to start developing.

## Env Vars

List of env vars and defaults:

| Name                            | Default                              |
| ------------------------------- | ------------------------------------ |
| LOG_LEVEL                       | debug                                |
| STRAVA_ACCESS_TOKEN             |                                      |
| STRAVA_CLIENT_ID                |                                      |
| STRAVA_CLIENT_SECRET            |                                      |
| ACTIVITIES_COLLECTION           | activities                           |
| ATHLETES_COLLECTION             | users                                |
| PROCESSED_ACTIVITIES_COLLECTION | processed-activities                 |
| MONGODB_URL                     | mongodb://localhost:27017/c2w-mongol |
| DB_NAME                         | c2w-mongol                           |
