const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    //eslint-disable-next-line
    console.log(`Server started on port ${PORT}`);
});
