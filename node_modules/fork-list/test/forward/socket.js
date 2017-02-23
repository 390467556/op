var net = require('net');
var assert = require('assert');
var http = require('http');
var ForkList = require('../');

var worker_list = new ForkList({
    path: './forward/sock_worker',
    num: 4
});

var port = 6982;

var server = net.createServer();
server.listen(port, function() {
    console.log('Test server start listen.. port:', port, ' pid:', process.pid);
});

server.on('connection', function(sock) {
    var record = sock.remoteAddress + ':' + sock.remotePort;

    console.log('[server] Connected: ', record);

    sock.on('data', function(data) {
        var urls = getArray(data);

        for (var i = urls.length - 1; i >= 0; i--) {
            worker_list.send(urls[i]);
        }
    });

    sock.on('close', function() {
        console.log('[server] Connection Closed record:', this.record);
    }.bind({
        record: record
    }));

    sock.on('error', function(e) {
        console.error('[server] Error:', e, ' record:', this.record);
    }.bind({
        record: record
    }));
});

var buffer = [];
var flag = false;

var getArray = function(data) {
    var str = data.toString();
    var arr = str.split('\0');

    if (flag) {
        if (buffer.length > 0) {
            arr[0] = buffer.shift() + arr[0];
        } else {
            // console.error("error buffer length!!");
            throw new Error("error buffer length!!");
        }
        flag = false;
    }

    if (str[str.length - 1] != '\0') {
        // pop uncomplete
        buffer.push(arr.pop());
        flag = true;
    } else {
        // pop \0 blank
        arr.pop();
    }


    return arr;
}