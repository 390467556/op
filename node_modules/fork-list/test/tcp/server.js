var ForkList = require("forklist");
var underscore = require('underscore')

var net = require('net');
var util = require('util');

var PORT = 6969;

var path = 'worker';
var num = 5;

var forklist = new ForkList({
    path: path,
    num: num,
    classifier: function classify(args, done) {
        done(null, underscore.random(0, num - 1));
    }
});

var server = net.createServer();

server.on('connection', function(sock) {

    console.log('[server] Connected: ' + sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data', function(data) {
        forklist.send(data.toString(), {
            ip: sock.remoteAddress,
            port: this.remotePort
        });

        sock.write('200');
    });

    sock.on('close', function() {
        console.log('[server] Closed: ' + sock.remoteAddress + ':' + sock.remotePort);
    });

    sock.on('error', function(e) {
        console.log('[server] Error:', e, ' ip:', sock.remoteAddress + ':' + sock.remotePort);
    })
});

server.listen(PORT);