var ForkList = require('fork-list');

var path = './script.js';
var num = 3;

var forks = new ForkList({
    path: path,
    num: num,
    log: true
});

for (var i = 1; i >= 0; i--) {
    forks.send('hello ' + i);
}

forks.on('error', function(err, pid) {
    console.log('--> Error:', err.message, 'pid:', pid);
});

forks.on('exit', function(pid) {
    console.log('--> Child process exit, pid:', pid);
    forks.killByPid(pid);
});

forks.on('finish', function() {
    console.log('--> All of child process has exited');
});

forks.shutdown();
