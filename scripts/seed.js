/* eslint-disable no-console */
const userSeeder = require('../seeders/init-users');
const surveySeeder = require('../seeders/init-surveys');
const questionSeeder = require('../seeders/init-questions');
const responsesSeeder = require('../seeders/init-responses');
const rolesSeeder = require('../seeders/init-roles');

(async () => {
  console.log(await userSeeder.up());
  console.log(await surveySeeder.up());
  console.log(await questionSeeder.up());
  console.log(await responsesSeeder.up());
  console.log(await rolesSeeder.up());
})();
