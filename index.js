console.log('NODE_ENV', process.env.NODE_ENV);

const express = require('express');
const path = require('path');
const http = require('http');
const helmet = require('helmet');
const bodyParser = require('body-parser');
// const cors = require('cors');
const compression = require('compression');
const app = express();
const parseurl = require('parseurl');
const multer = require('multer');

app.use(compression()); //Compress all routes
app.use(helmet()); 
app.disable('x-powered-by');
app.set('trust proxy', 1) // trust first proxy
const PORT = process.env.PORT || '3000';
app.set('PORT', PORT);

// Get our API routes
const routes = require('./routes');
// const mailer = require('./mailer');

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });


// Point static path to dist

// DEVELOPMENT
app.use(express.static(path.join(__dirname, './../dist')));
app.use(express.static(path.join(__dirname, './../dist/bearded-app')));
app.use(express.static(path.join(__dirname, './../dist/bearded-app/assets')));
app.use(express.static(path.join(__dirname, './../documents')));
app.use(express.static(path.join(__dirname, './../documents/profiles')));

// Set our api routes
app.use('/api', routes);
// app.use('/mailer', mailer);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile((path.join(__dirname, './../dist/bearded-app/index.html')));

});

/** Create HTTP server.*/
const server = http.createServer(app);
/** Listen on provided port, on all network interfaces. */
server.listen(PORT, () => console.log('Server Listening'));
module.exports = app;

