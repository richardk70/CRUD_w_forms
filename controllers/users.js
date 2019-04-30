const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connUri = process.env.URL;

module.exports = {
    getAll: function(req, res) {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                const payload = req.decoded;

                if (payload && payload.user === 'admin') {
                    User.find({}, (err, users) => {
                        if (!err) {
                            result.status = status;
                            result.error = err;
                            result.result = users;
                        } else {
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    });
                } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                    res.status(status).send(result);
                }
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
            User.find({}, (err, users) => {
                if (!err) {
                    res.send(users);
                } else {
                    console.log('Error: ' + err);
                }
            });
        });
    },
    login: function(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 200;
            if (!err) {
                User.findOne( {email}, function(err, user) {
                    if (!err && user) {
                        bcrypt.compare(password, user.password)
                            .then(match => {
                                if (match) {
                                    status = 200;
                                    // create JWT
                                    const payload = { user: user.email };
                                    const options = { epxiresIn: '2d', issuer: 'Sample' };
                                    const secret = process.env.JWT_SECRET;
                                    const token = jwt.sign(payload, secret, options);

                                    console.log('token: ' + token);
                                    result.token = token;
                                    result.status = status;
                                    result.result = user;
                                } else {
                                    status = 401;
                                    result.status = status;
                                    result.error = 'Authentication error.';
                                }
                                res.status(status).send(result);
                            });
                    } else {
                        status = 404;
                        result.status = status;
                        result.error = err;
                        res.status(status).send(result);
                    }
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    add: function(req, res) {
        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
            let result = {};
            let status = 201;
            if (!err) {
                const email = req. body.email;
                const password = req.body.password;
                let user = new User();
                user.email = email;
                user.password = password;

                user.save(function(err, user) {
                    if (!err) {
                        result.status = status;
                        result.result = user;
                    } else {
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
            }
        });
    },
}