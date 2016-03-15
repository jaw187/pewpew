'use strict';

const Child = require('child_process');
const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Path = require('path');


const internals = {};


const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('pewpew', () => {

    it('sends requests to host', (done) => {

        const server = new Hapi.Server();
        server.connection({ host: 'localhost' });

        let counter = 0;
        server.route({
            method: 'GET',
            path: '/heartbeat',
            handler: (request, reply) => {

                return reply({ status: 'OK' });
            }
        });

        server.start((err) => {

            expect(err).to.not.exist();

            const pewpew = Child.spawn(Path.join(__dirname, '../bin/pewpew'), [server.info.uri + '/heartbeat']);
            pewpew.on('close', () => {

                expect(counter).to.equal(1000);
                done();
            });
        });
    });
});
