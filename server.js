require('dotenv').config();
const app = require('./server/app');
const serverless = require('serverless-http');

const PORT = process.env.PORT || 5000;

module.exports.handler = serverless(app);

app.listen(PORT, () => {
  //eslint-disable-next-line
  console.log(`Server started on port ${PORT}`);
});
