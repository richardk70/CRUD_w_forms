// const express = require('express');
// const app = express();

module.exports = function (app) {
    const bcrypt = require('bcrypt');
    const flash = require('connect-flash');
    const session = require('express-session');

    // the model
    const User = require('../models/user');


    // ROUTES
    app.get('/', function(req, res) {
            res.render('index.html', {
                partials: 
                    { nav: __dirname + '/../views/nav.html' }
            });
        });

    app.get('/admin', function(req, res) {
        User.find(function(err, students) {
            if (err) res.send(err);
    
            var schools = students.map( (el) =>{
                return el.school;
            });
            let uniques = [...new Set(schools)];

        res.render('admin.html', {
            locals: { array: students , schools: uniques, msgExists: '' },
            partials: { nav: __dirname + '/../views/nav.html' }    
        });
    }); 
});

    app.get('/register', function(req, res) {
        res.render('register.html', {
            locals: { msgExists: '' },
            partials: { nav: __dirname + '/../views/nav.html' }    
        });
    });

    app.post('/register', function(req, res) {
        // get the form contents
        var name = req. body.name;
        var email = req. body.email;
        var password = req.body.password;
        var password2 = req.body.password2;

        // first, check if passwords match
        if (password == password2) {
            ;
        } else {
            // passwords do not match
            console.log('Passwords do not match');
            res.render('register', {
                locals: {
                    msgExists: 'Passwords do not match.'
                },
                partials: { nav: __dirname + '/../views/nav.html' } 
            });
        }
        
        // second, check if user is unique
        User.findOne({email: email})
            .then(user => {
                if (user) {
                    // user already exists
                    res.render('register', {
                        locals: {
                            msgExists: 'User already exists.'
                        },
                        partials: { nav: __dirname + '/../views/nav.html' }
                    });
                } else {
                    // user does NOT exist. we can setup the user object
                    var newUser = new User({ name, email, password });
                    // then encrypt the entered password
                    bcrypt.hash(newUser.password, 10, function(err, hash) {
                        if (err) throw err;

                        newUser.password = hash;
                        // now you SAVE the user
                        newUser.save( function(err) {
                            if (err) 
                                res.send(err);
                
                            console.log('New user saved.');
                            res.render('login', {
                                locals: {
                                    msgExists: `${name} registered.`
                                },
                                partials: { nav: __dirname + '/../views/nav.html' }
                            });
                        });
                    });
                } });
    });

    app.get('/login', function(req, res) {
        res.render('login.html', {
            locals: { msgExists: '' },
            partials: { nav: __dirname + '/../views/nav.html' }    
        });
    });

    app.post('/login', function(req, res) {
        // get the form contents
        var email = req.body.email;
        var password = req.body.password;
        var dbPW = "";

        // first, check if the email address exists in the DB
        User.findOne({email: email})
            .then(match => {
                if (!match) {
                    // then let user know
                    // user already exists
                    res.render('login', {
                        locals: {
                            msgExists: 'Unknown email. Please try again.'
                        },
                        partials: { nav: __dirname + '/../views/nav.html' }
                    });
                } else {
                    // then compare passwords
                    bcrypt.compare(password, match.password, function(err) {
                        if (err) throw err;

                        // passwords match, log into the system
                        res.render('index', {
                            partials: { nav: __dirname + '/../views/nav.html' }
                        });
                    });
                }
            });
    });
    
    app.post('/students', function(req, res) {
        // console.log(req);
        var student = new User();
        student.name = req.body.name;
        student.email = req.body.email;
        student.password = req.body.password;

        student.save(function(err) {
            if (err) 
                res.send(err);

            // send JSON message through POSTMAN
            // res.json( { message: "Student saved." });
            console.log('New user saved.');
            res.redirect('/'); // will list all the students again
        });
    });

    app.post('/delete', function(req, res) {
        var idToDelete = req.body.id;
        User.findOneAndDelete({_id: idToDelete}, function(err, student) {
            if (err)
                res.send(err);
    
            // res.send(student); // returning the student who was delted
            console.log('Student deleted.'); 
        });
        res.redirect('/');
    });
    
    app.post('/update', function(req, res) {
        var idToUpdate = req.body.id;

        User.findOneAndUpdate(
            { "_id": idToUpdate },
            { "name": req.body.newName, "school": req.body.newSchool },
            function(err, student) {
                if (err) throw err;
    
                console.log('Student updated.');
            }
        );
        res.redirect('/');
    });

}


