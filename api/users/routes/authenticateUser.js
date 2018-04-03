'use script';

const Boom = require('boom');
const User = require('../model/User');
const authenticateUserSchema = require('../schemas/authenticateUser');
const verifyCredentials = require('../util/userFunctions').verifyCredentials;
const createToken = require('../util/token');

module.exports = {
    method: "POST",
    path: "/api/users/authenticate",
    config: {
        pre: [
            { method: verifyCredentials, assign: 'user' }
        ],
        validate: {
            payload: authenticateUserSchema
        },
        auth: false
    },
    handler: (request, reply) => {
        reply({ id_token: createToken(request.pre.user), user: request.pre.user }).code(201);
    }    
}