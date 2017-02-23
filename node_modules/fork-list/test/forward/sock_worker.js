var ForkList = require('../../');

ForkList.proc(function(sock) {
    var workid = this.workid;
    sock.on('data', function(data) {
        process.stdout.write(data);
    })
});