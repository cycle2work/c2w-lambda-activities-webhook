[![Build Status](https://travis-ci.org/mondora/cycle2work-activities.svg?branch=master)](https://travis-ci.org/mondora/cycle2work-activities)
[![Dependency Status](https://david-dm.org/mondora/cycle2work-activities.svg)](https://david-dm.org/mondora/cycle2work-activities)
[![devDependency Status](https://david-dm.org/mondora/cycle2work-activities/dev-status.svg)](https://david-dm.org/mondora/cycle2work-activities#info=devDependencies)

# cycle2work-activities

AWS Lambda function to persist user activities data and enjoy [`Cycle2work`](https://cycle2work.io).

After cloning the repository, run `npm install` or [`yarn`](https://yarnpkg.com) to install all dependencies.

## Table of Contents

- [Configuration](#folder-structure)
  - [Env Vars](#env-vars)

## Configuration

The lambda can be configured using a [`dotenv`](https://github.com/motdotla/dotenv) file (key=value format).

## Env Vars

Example of `.env` file:

```
STRAVA_ACCESS_TOKEN="your_strava_access_token"
STRAVA_CLIENT_ID="your_strava_client_id"
STRAVA_CLIENT_SECRET="your_strava_client_secret"
LOG_LEVEL=debug
```
