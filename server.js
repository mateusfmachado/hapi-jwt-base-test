'use strict';

const Hapi = require('hapi');

// helper modules
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');

// key
const AUTH_KEY = require('./config/env').AUTH_KEY;

// $lab:coverage:off$

// URL Database
const dbUrl = 'mongodb://localhost:27017/'+
              ( process.env.ENV === 'test' ? 
                'hapi-jwt-test' 
                : 'hapi-jwt' 
              );

const server = new Hapi.Server();

server.connection({
    host: '0.0.0.0',
    port: '9850'
});

server.register([
    {
        register: require('hapi-cors'),
        options: {
            methods: ['POST, GET, PATCH, DELETE, OPTIONS']
        }
    }, 
    require('hapi-auth-jwt2')
], function (err) {

    if(err){
      console.log(err);
    }

    server.auth.strategy('jwt', 'jwt',
    {   
        key: AUTH_KEY,
        validateFunc: require('./api/users/util/userFunctions').validateToken,
        verifyOptions: { 
            ignoreExpiration: true, 
            algorithms: [ 'HS256' ] 
        },
        tokenType: "Token"
    });

    server.auth.default('jwt');

    glob.sync('api/**/routes/*.js', { 
        root: __dirname 
    }).forEach(file => {
        const route = require(path.join(__dirname, file));
        server.route(route);
    });

});


server.start((err) => {
    if(err){
        throw err;
    }

    mongoose.connect(
        dbUrl, 
        { useMongoClient: true }, 
        (err) => { if (err) throw err; }
    );

    console.log('Running at ', server.info.uri);
});
// $lab:coverage:on$
module.exports = server;