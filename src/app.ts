const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./poketeam');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/poketeam', router);

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});