const HashIds = require('hashids/cjs');
const hashIds = new HashIds(process.env.HASH_SECRET, 8);

module.exports = hashIds;
