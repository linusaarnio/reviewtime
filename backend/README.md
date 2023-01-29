## Description

Nest.js Backend for the Reviewtime web application.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Environment variables:
To run the application, the following environment variables need to be set.
They can also exist in a .env file in the root of the repository.

- REVIEWTIME_API_PORT

- GITHUB_APP_ID
- GITHUB_APP_PRIVATE_KEY
- GITHUB_APP_OAUTH_CLIENT_ID
- GITHUB_APP_OAUTH_CLIENT_SECRET
- GITHUB_APP_WEBHOOK_SECRET

- SESSION_COOKIE_SECRET
- SECURE_SESSION_COOKIE (true/false)
