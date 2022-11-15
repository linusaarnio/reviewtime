# Reviewtime

A web application to ensure that no PR in your organization goes too long without a review, while noone has to chase others around nagging them for reviews.

## Specification

### Functional

Reviewtime allows the organization owner to set a standard SLA time for pull request reviews. Whenever a PR is added in GitHub by someone in the organization, it shows up in reviewtime. If a reviewer is added in GitHub, they are also added in reviewtime. You can also add reviewers in RT. If the reviewer has not submitted a review when the deadline is coming closer, they get a reminder by notification in the web app and through Slack.

When viewing a persons profile you can see which PR:s they have reviewed and which PR:s they have created.

Login is through GitHub, users have to manually connect their Slack accounts.

### Technological

The system consists of a frontend application, a backend application and registered GitHub and Slack apps.

#### Frontend

The frontend is a React application using Typescript. It communicates both with the backend and directly with GitHub, through their respective api:s.

#### Backend

The main backend component is a Node.js app. These are the technical choices:
- Nest.js to expose a json api
- Typescript for language.
- PostgreSQL database with Prisma for ORM and migrations. 
- Accepts incoming webhooks from GitHub for updates on pull requests.
- Interaction with GitHub (both api access and webhook handling) is done using the official octokit sdk. 
- Uses graphile workers to schedule jobs using Postgresql. 
- The scheduled jobs trigger reminders through Slack. 
- The Slack integration is done by storing incoming webhooks for each user 



