// from simple
// server.js

require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const es6Render = require('express-es6-template-engine');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// set up template engine
app.engine('html', es6Render);
app.set('views', './views');
app.set('view engine', 'html');

// set static folder
app.use('/public', express.static(__dirname + '/public'));
// app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true })); // get info from HTML forms

// set the port
const PORT = 3000;

// set the database URL and connect
const URL = process.env.URL;
mongoose.connect(URL, { useNewUrlParser: true });

// middleware
// Express Session middleware setup
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true
}));
// Connect Flash middleware
app.use(flash());

// global variables for Flash messages
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use( (req, res, next) => {
    console.log('database touched');
    next();
});

// ensure authentication
function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', "You are not logged in.");
        res.redirect('/login');
    }
}

// ROUTES
require('./routes/routes')(app);

// listen
app.listen(PORT, console.log('Listening port 3000...'));