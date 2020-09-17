const { exec } = require('child_process');
module.exports = async () => {
  exec('NODE_ENV=test npm run db:drop', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    if (stderr) {
      console.error(err);
      return;
    }
    //eslint-disable-next-line
    console.log(stdout);
  });
};
