'use strict';

const jwt = require('jsonwebtoken');
const secret = require('../../../config/env').AUTH_KEY;

function createToken(user){

    return jwt.sign({
        id: user._id,
        username: user.username,
        scopes: user.scope
    }, secret, {
        algorithm: 'HS256',
        expiresIn: '1y'
    });
}

module.exports = createToken;