var net = require('net');

var client = net.connect({
    port: 6969
});

client.on('connect', function() {
    client.write('hello world!\r\n');
});

client.on('data', function(data) {
    console.log(data.toString());
    client.end();
});

client.on('end', function() {
    console.log('客户端断开连接');
});