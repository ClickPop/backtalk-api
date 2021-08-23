require('dotenv').config();
const app = require('./server/app');
const functions = require('firebase-functions');
const PORT = process.env.PORT || 5000;

exports.expressApi = functions.runWith({ memory: '1GB' }).https.onRequest(app);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    //eslint-disable-next-line
    console.log(`Server started on port ${PORT}`);
  });
}
