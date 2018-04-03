'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../model/User');
const createUserSchema = require('../schemas/createUser');
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;
const createToken = require('../util/token');

function hashPassword(password, cb) {
    //Generate a salt at level 10
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            return cb(err, hash);
        });
    });
}

module.exports = {
    method: "POST",
    path: "/api/users",
    config: {
        pre: [
            {
                method: verifyUniqueUser, assign: 'user'
            }
        ],
        validate: {
            payload: createUserSchema
        },
        auth: false
    },
    handler: (request, reply) => {

        let user = new User();
        user.email = request.payload.email;
        user.username = request.payload.username;
        user.admin = false;

        hashPassword( request.payload.password, (err, hash) => {
            
            // $lab:coverage:off$
            if(err){
                throw Boom.badRequest(err);
            }
            // $lab:coverage:on$
            user.password = hash;
            user.save().then((user) => {
                //if success, emit JWT
                reply({
                    id_token: createToken(user),
                    user
                })
                .code(201);
            })
            // $lab:coverage:off$
            .catch((err) => {
                throw Boom.badRequest(err);
            });
            // $lab:coverage:on$

        } );

    }
};