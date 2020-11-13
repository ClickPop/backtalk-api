[![Tests](https://img.shields.io/circleci/build/gh/ClickPop/backtalk-api?label=Tests&style=for-the-badge)](https://circleci.com/gh/ClickPop/backtalk-api) ![Coverage](https://img.shields.io/coveralls/github/ClickPop/backtalk-api?style=for-the-badge)

# Backtalk API

## Prerequesites

- [Node.JS](https://nodejs.org/)
- Preferrably an IDE/Code editor that supports an ESLint plugin
- Git (Obviously)
- [Postgres](https://www.postgresql.org/download/) (Installed, setup script will create database if you haven't already)

## Instructions

1. Clone this repository
   `git clone https://github.com/clickpop/backtalk-api.git`
2. Enter repository
   `cd backtalk-api`
3. Make sure Postgres is installed / running
4. Update `.env` file with appropriate Postgres settings
5. Setup the project using one of the following:

   - **DON'T HAVE THE DATABASE YET** (you'll still need Postgres running)
     `npm run setup`

   - **HAVE A DATABASE AND WANT TO WIPE IT OUT**:
     `npm run setup:clean`

   - **HAVA A DATABASE AND WANT TO KEEP THE DATA INTACT** (will add new migrations)
     `npm run setup:keep`

6. Start the server
   `npm run dev`

## NPM Scripts

- `npm install` Installs all dependancies
- `npm start` Starts the API server **NOTE:** _Just use `npm run dev` from below_
- `npm run dev` - Starts the development server with hot-reloading
- `npm run db:create` - Creates the database for you based on your .env file
- `npm run db:drop` - Drops the database for you based on your .env file
- `npm run db:recreate` - Drops then creates the database for you based on your .env file
- `npm run migrate` - Runs all un-run migrations to setup your database
- `npm run migrate:fresh` - Runs all migrations to setup your database
- `npm run seed` - Runs all un-run seeders to seed your database
- `npm run seed:fresh` - Runs all seeders to seed your database
- `npm run setup` - Installs all dependancies then runs db:create, migrate, and seed
- `npm run setup:clean` - Installs all dependancies then runs db:recreate, migrate, and seed
- `npm run setup:clean-no-install` - Runs db:recreate, migrate, and seed
- `npm run setup:keep` - Installs all dependancies then runs migrate and seed
- `npm test` - Runs all tests
- `npm test:verbose` - Runs all tests in verbose mode
- `npm test:watch` - Runs all tests in watch mode to re-test every time you make a change
- `npm lint` - Runs the linter in-case your IDE doesn't have built in ESLint support
- `npm format` - Runs the code formatter in-case your IDE doesn't have built in Prettier support
- `npm run docker-up` - Runs this docker-compose up command for the backend
- `npm run docker-down` - Runs this docker-compose down command for the backend
- `npm run docker-up:combined` - Runs this docker-compose up command for the backend and frontend _See A Note on Docker section below_
- `npm run docker-down:combined` - Runs this docker-compose down command for the backend and frontend _See A Note on Docker section below_

## A note on docker

Feel free to use the docker npm scripts we have setup. Just be sure that all of the stuff labeled under the Database and Docker sections of the .env are filled in with the correct information.

If you want this to also handle the frontend you just need to clone the [backtalk-ui](https://github.com/clickpop/backtalk-ui/) repo into a folder called 'client'. The `npm run docker-up:combined` command will handle the rest.

If you need help with this, please feel free to reach out.

## A Word about Contributing

> **Note:** We will not accept any PR's that don't follow our Guidelines

This project now utilizes Git-Flow. Internally, we use HubFlow as a CLI tool to help manage our Git-Flow feature, release, and hotfix branches. While not necessary, it is highly recommended that you utilize a similar CLI tool, to help enforce the guidelines we've outlined in the [Backtalk Contributing Guidelines](CONTRIBUTING.md).

While you're reading things, you should probably also check out our [Code of Conduct](CODE_OF_CONDUCT.md).
