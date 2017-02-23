var net = require('net');
var config = require('./sock_config');
var ForkList = require("../../");

var num = 2;
var path = './sock_worker';

var wokers = new ForkList({
    path: path,
    num: num
});

var server = net.createServer();

server.on('connection', function(sock) {

    wokers.foward('socket', sock);

    sock.on('error', function(e) {
        console.log('[server] Error:', e);
    });
});

server.listen(config.port);

console.log('test socket server start');