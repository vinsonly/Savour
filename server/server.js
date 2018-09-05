require('dotenv').config(); // load the environment variables
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appRoot = require('app-root-path');

global.appRoot = appRoot;

if( process.env.DB_USER == null
  || process.env.DB_PASSWORD == null
  || process.env.NODE_ENV == "development") {
    mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });
  } else {
    mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds145752.mlab.com:45752/savour-dev`, { useNewUrlParser: true });
  }


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

// production
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// catch other routes and send 404
app.get("*", (req, res) => {
  res.status(404).send("Route does not exist");
})

app.listen(port, () => console.log(`Listening on port ${port}`));
