'use strict';

const Boom = require('boom');
const User = require('../model/User');
const bcrypt = require('bcrypt');

function verifyUniqueUser(req,res){

    User.findOne({
        $or: [
            { email: req.payload.email },
            { username: req.payload.username }
        ]
    })
    .then((user)=> {

        if(user){
            if(user.username === req.payload.username){
                res(Boom.badRequest('Nome de usuário já em uso.'));
            }
            if(user.email === req.payload.email){
                res(Boom.badRequest('Email já em uso.'));
            }
        } else {
            res(req.payload);
        }        
    })
    // $lab:coverage:off$
    .catch((err) => {
        res(Boom.badRequest('Error'));
    });
    // $lab:coverage:on$

}

function verifyCredentials(req,res){

    const password = req.payload.password;

    User.findOne({
        $or: [
            {
                email: req.payload.email
            },
            {
                username: req.payload.username
            }
        ]
    })
    .then((user) => {
        if(user){
            bcrypt.compare(password, user.password, (err, isValid) => {
                if(isValid){
                    res(user);
                } else {
                    res(Boom.badRequest('Senha incorreta'));
                }
            });
        } else {
            res(Boom.badRequest('Email ou nome de usuário incorreto'));
        }
    })
    // $lab:coverage:off$
    .catch(err => {
        throw res(Boom.badRequest('Error'))
    });
    // $lab:coverage:on$

}

function getUserData(req,res){

    const _id = req.auth.credentials.id;

    User.findById(_id)
    .select({ __v: 0, password: 0, admin: 0 })
    .then(user => {
        res(user);
    })
    // $lab:coverage:off$
    .catch(err => Boom.badRequest('Server Error'));
    // $lab:coverage:on$

}

// VALIDATE JWT TOKEN 
function validateToken(decoded, request, callback) {

    const _id = decoded.id;

    User.findById(_id)
    .then(user => {
        if(user) callback(null, true, user );
        else callback(null, false);
    })
    // $lab:coverage:off$
    .catch(err => {        
        throw Boom.badRequest('Token not validated');
    });
    // $lab:coverage:on$

     
};

module.exports = {
    verifyUniqueUser,
    verifyCredentials,
    getUserData,
    validateToken
};