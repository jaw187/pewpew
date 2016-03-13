'use strict';

const Insync = require('insync');
const Nomnom = require('nomnom');
const Wreck = require('wreck');


const internals = {};


internals.main = function () {

    const args = Nomnom.options({
        url: {
            position: 0,
            help: 'URL to send requests to',
            required: true,
            type: 'string'
        },
        max: {
            abbr: 'm',
            help: 'Maximum number of requests to send',
            default: 1000
        },
        limit: {
            abbr: 'l',
            help: 'Limit of how many parallel requests to make',
            default: 10
        },
        wreckOptions: {
            abbr: 'o',
            help: 'Path to JSON file with Wreck request options',
            type: 'string'
        }
    }).parse();

    const url = args.url;
    try {
        const options = args.wreckOptions ? JSON.parse(Fs.readFileSync(args.wreckOptions)) : {};
    }
    catch (e) {
        throw e;
    }

    let counter = 0;

    const get = function (i, next) {

        Wreck.get(url, options, function (err, res, result) {

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
    const il = args.max;

    for (let i = 0; i < il; ++i) {
        queue.push(i);
    }

    Insync.mapLimit(queue, args.limit, get, function (err) {

        console.log('Sent ' + counter + ' requests');
        if (err) {
            console.log(err);
        }
    });
};


internals.main();
