var forkList = require('forklist');

console.log('worker started pid' + process.pid);

forkList.proc(function(sock) {

    console.log('[server] Connected: ' + sock.remoteAddress + ':' + sock.remotePort);

    sock.write('start');

    sock.on('data', function(data) {
        var str = data.toString();
        console.log('str:', str);
       
        sock.write(result.toString());
        sock.end();
    });

    sock.on('close', function() {
        console.log('[server] Connection Closed');
    });

    sock.on('error', function(e) {
        console.log('[server] Error:', e);
    });
});