const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appRoot = require('app-root-path');

global.appRoot = appRoot;

mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

app.locals.appName = 'Savour';

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Savour Backend' });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// set up the set the routes defined in /server/routers to be endpoint
require('./routes')(app);

// catch other routes and send 404
app.get("*", (req, res) => {
  res.status(404).send("Route does not exist");
})

app.listen(port, () => console.log(`Listening on port ${port}`));
