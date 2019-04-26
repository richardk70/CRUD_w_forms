// from simple
// server.js

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const es6Render = require('express-es6-template-engine');

const app = express();

// set up template engine
app.engine('html', es6Render);
app.set('views', './views');
app.set('view engine', 'html');

// the model
const Student = require('./student');

// set up the express app
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true })); // get info from HTML forms

// set the port
const PORT = 3000;

// set the database URL and connect
const URL = 'mongodb://localhost:27017/simple';
mongoose.connect(URL, { useNewUrlParser: true });

// middleware
app.use( (req, res, next) => {
    console.log('database touched');
    next();
});

// ROUTES
require('./routes')(app);

// listen
app.listen(PORT, console.log('Listening port 3000...'));