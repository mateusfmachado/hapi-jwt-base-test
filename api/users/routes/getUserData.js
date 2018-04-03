'use strict';

const User = require('../model/User');
const getUserData = require('../util/userFunctions').getUserData;

module.exports = {
    method: "GET",
    path: "/api/user",
    config: {
        pre: [
            { 
                method: getUserData, assign: 'user' 
            }
        ]
    },
    handler: (request, reply) => {
        reply({ 
            user: request.pre.user
        })
    }
};