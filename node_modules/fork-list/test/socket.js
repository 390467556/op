var spawn = require('child_process').spawn;

var server = spawn('node', ['./sock_server'], { cwd: './forward'});

describe('ForkList', function() {
    describe('.forward socket', function() {
        it('should recv 100 msg', function(done) {
            var list = [];

            server.stdout.on('data', function(msg) {
                if (msg.toString() == 'test socket server start\n') {
                    var client = spawn('node', ['./sock_client'], { cwd: './forward'});
                    return;
                }

                var data = msg.toString().split('\0');
                if (data[data.length - 1].length < 1) {
                    data.pop();
                }

                list = list.concat(data);

                if (list.length > 99) {
                    server.kill();
                    done();
                }
            });
        });
    });
});