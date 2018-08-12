const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

app.locals.appName = 'Savour';

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// set up the set the routes defined in /server/routers to be endpoint
require('./routes')(app);

app.listen(port, () => console.log(`Listening on port ${port}`));
