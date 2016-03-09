'use strict';

const Insync = require('insync');
const Wreck = require('wreck');


const internals = {};


internals.url = 'http://google.com';
internals.max = 1000;
internals.limit = 10;


internals.main = function () {

    const url = internals.url;
    let counter = 0;

    const get = function (i, next) {

        Wreck.get(url, function (err, res, result) {

            ++counter;
            console.log(counter)

            if (err) {
                return next(err);
            }

            if (res.statusCode !== 200) {
                return next(new Error('non 200: ' + res.statusCode));
            }

            return next();
        });
    };

    const queue =[];
    const il = internals.max;

    for (let i = 0; i < il; ++i) {
        queue.push(i);
    }

    Insync.mapLimit(queue, internals.limit, get, function (err) {

        console.log('Sent ' + counter + ' requests');
        if (err) {
            console.log(err);
        }
    });
};


internals.main();
