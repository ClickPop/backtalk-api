/* eslint-disable */
require('dotenv').config();
var exec = require('child_process').exec;

console.log('Setting up containers... This can take a while');
const command = `docker-compose up -d --build ${
  process.env.COMBINED === 'true'
    ? '&& cd client/ && docker-compose up -d --build'
    : ''
}`;
console.log(command);
let str = '';
const int = setInterval(() => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  str += '#';
  if (str.length > process.stdout.columns) str = '';
  process.stdout.write(str);
}, 750);

exec(command, (err, stdout, stderr) => {
  process.stdout.clearLine();
  clearInterval(int);
  if (err) console.error(err);
  if (stderr) console.error(stderr);
  console.log(stdout);
});
