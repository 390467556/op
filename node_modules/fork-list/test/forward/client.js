var net = require('net');

var client = net.connect({
    port: 6969
});

client.on('data', function(data) {
    var str = data.toString();
    console.log(str);

    if (str == 'start') {
        var str = 'hello';
        client.write(str);
    } else {
        client.end();
    }

});

client.on('end', function() {
    console.log('客户端断开连接');
});