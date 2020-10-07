const { exec } = require('child_process');
const env = process.env.NODE_ENV || 'development';

module.exports = async () => {
  exec(
    'cross-env-shell NODE_ENV=test npm run db:drop',
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stderr) {
        console.error(err);
        return;
      }

      if (env === 'development') {
        // eslint-disable-next-line
        console.log(stdout);
      }
    },
  );
};
