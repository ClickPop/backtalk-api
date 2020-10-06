[![CircleCI](https://img.shields.io/circleci/build/gh/ClickPop/backtalk-api?label=Tests&style=for-the-badge)](https://circleci.com/gh/ClickPop/backtalk-api)
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

## A Word about Contributing

> **Note:** We will not accept any PR's that don't follow our Guidelines

This project now utilizes Git-Flow. Internally, we use HubFlow as a CLI tool to help manage our Git-Flow feature, release, and hotfix branches. While not necessary, it is highly recommended that you utilize a similar CLI tool, to help enforce the guidelines we've outlined in the [Backtalk Contributing Guidelines](CONTRIBUTING.md).

While you're reading things, you should probably also check out our [Code of Conduct](CODE_OF_CONDUCT.md).
