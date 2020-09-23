const { exec } = require('child_process');

const cmd = (cmd) => {
  return new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        rej(err);
      }
      if (stderr) {
        rej(stderr);
      }
      res(stdout);
    });
  });
};

module.exports = async () => {
  try {
    const create = await cmd('cross-env-shell NODE_ENV=test npm run db:create');
    // eslint-disable-next-line
    console.log(create);
    const migrate = await cmd(
      'cross-env-shell NODE_ENV=test npm run migrate:fresh',
    );
    // eslint-disable-next-line
    console.log(migrate);
    const seed = await cmd('cross-env-shell NODE_ENV=test npm run seed:fresh');
    // eslint-disable-next-line
    console.log(seed);
  } catch (err) {
    console.error(err);
  }
};
