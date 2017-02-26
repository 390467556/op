var dbmanager = require('../myapp/db/dbmanager');
var ForkList = require('fork-list');
var path = './scheduleTimer';
var num = 3;
var forks = new ForkList({
    path: path,
    num: num,
    log: true
});


// var taskid = '58aba9c211efdb394a404093';
// var username = "wangzhe";

/**
 * [startPrestTimer 开启多个tak任务]
 * @param  {[type]} taskids [description]
 * @return {[type]}         [description]
 */
exports.startPrestTimers = function(taskids) {
    if (taskids === "" || taskids.length <= 0) {
        console.log("taskids为空");
        return;
    }
    for (var i = 0; i < taskids.length; i++) {
        exports.startPrestTimer(taskids[i]);
    }
};


exports.startPrestTimer = function(taskid) {
    forks.send(1, taskid);
};

//启动爬虫
exports.startShowTimers = function(usernames) {
    if (usernames === undefined || usernames === "") {
        console.log("usernames为空");
        return;
    }
    for (var i = 0; i < usernames.length; i++) {
        exports.startShowTimer(usernames[i]);
    }
};

exports.startShowTimer = function(username) {
    forks.send(2, username);
};

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
