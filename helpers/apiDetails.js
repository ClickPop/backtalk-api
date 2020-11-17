const pjson = require('../package.json');
const apiDetails = {
  name: pjson.name,
  version: pjson.version,
};
const rootResponse = {
  data: 'Welcome to the Backtalk API',
};

if (pjson.author) {
  apiDetails.author = pjson.author;
}
if (pjson.contributors) {
  apiDetails.contributors = pjson.contributors;
}
if (pjson.homepage) {
  apiDetails.homepage = pjson.homepage;
}

rootResponse.api = apiDetails;

module.exports = {
  apiDetails: apiDetails,
  rootResponse: rootResponse,
  default: apiDetails,
};
