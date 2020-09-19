require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  //eslint-disable-next-line
  console.log(`Server started on port ${PORT}`);
});
