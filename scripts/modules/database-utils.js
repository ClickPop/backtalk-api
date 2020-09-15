/* eslint-disable no-console */
const pgtools = require('pgtools');

// Verbose logger
const toError = (err) => {
  let name = typeof err.name !== 'undefined' ? err.name : 'unknown_error';

  if (process.argv.includes('--verbose')) {
    console.error(err);
  } else {
    console.error('There was an error:', name);
  }
};
const toRes = (res) => {
  if (process.argv.includes('--verbose')) {
    console.log(res);
  }
};

module.exports.create = (name, config, recreate = false) => {
  pgtools.createdb(config, name, (err, res) => {
    if (err) {
      if (
        typeof err.name !== 'undefined' &&
        err.name === 'duplicate_database'
      ) {
        // Let the user know it exists
        console.error('Database exists:', name);

        // Check boolean value to recreate database
        if (recreate) {
          console.log('Recreating database...');

          // Call drop database method
          pgtools.dropdb(config, name, (err, res) => {
            if (err) {
              toError(err);
              process.exit(-1);
            } else {
              toRes(res);
              console.log('Database dropped:', name);

              // Call create database method (again)
              pgtools.createdb(config, name, (err, res) => {
                if (err) {
                  toError(err);
                  process.exit(-1);
                } else {
                  toRes(res);
                  console.log('Database created:', name);
                }
              });
            }
          });
        } // End: recreate logic
      } else {
        toError(err);
        process.exit(-1);
      }
    } else {
      toRes(res);
      console.log('Database created:', name);
    }
  });
};
