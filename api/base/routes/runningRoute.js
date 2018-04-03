'use strict';

module.exports = {
    method: "GET",
    path: "/",
    config: {
        auth: false
    },
    handler: (request, reply) => {
        reply({ running: true })
    }
};