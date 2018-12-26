const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {resToErr, resToSuccess, throwError} = require('../../services/util.service');

module.exports.signupUser = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return resToErr(res, {message: 'Email exists'}, 409);
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return resToErr(res, err, 500);
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                resToSuccess(res, result, 201);
                            })
                            .catch(err => {
                                resToErr(res, err, 500);
                            });
                    }
                })
            }
        });    
}

module.exports.loginUser = (req, res, next) => {
    User.find({email: req.body.email}).exec()
    .then(users => {
        if (users.length < 1) {
            return resToErr(res, {message: 'Auth failed'}, 401);
        }
        const token = jwt.sign({
            email: users[0].email,
            userId: users[0]._id
        }, process.env.JWT_KEY, 
        {
            expiresIn: "1h"
        });
        bcrypt.compare(req.body.password, users[0].password, (err, result) => {
            if (err) {
                resToErr(res, 'Auth failed', 401);
            }
            if (result) {
                return resToSuccess(res, {message: 'Auth successful', token: token}, 200);
            }
        });
    })
    .catch(err => {
        resToErr(res, err, 500);
    })
};

module.exports.deleteUser = (req, res, next) => {
    User.deleteOne({_id: req.params.id}).exec()
        .then(result => {
            resToSuccess(res, {message: 'User Deleted'}, 200);
        })
        .catch(err => {
            resToErr(res, err, 500);
        });
};