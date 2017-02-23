var config = require('./sock_config');
var net = require('net');

var client = net.connect({
    hostname: config.host,
    port: config.port
});

client.on('connect', function() {
    var str = 'hello ';
    for (var i = 0; i < 100; i++) {
        var msg = str + i;
        console.log(msg);
        client.write(msg + '\0');
    }
    client.end();
});