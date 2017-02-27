/**
 * [timerManager 设置任务的管理类]
 */
var ForkList = require('fork-list');
var path = './scheduleTimer';
var num = 3;
var forks = new ForkList({
    path: path,
    num: num,
    log: true
});



/**
 * [startPrestTimer 设置多个tak任务]
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

/**
 * [startPrestTimer 设置单个task任务]
 * @param  {[type]} taskid [description]
 * @return {[type]}        [description]
 */
exports.startPrestTimer = function(taskid) {
    forks.send(1, taskid);
};

/**
 * [startShowTimers 设置多个爬虫任务]
 * @param  {[type]} usernames [description]
 * @return {[type]}           [description]
 */
exports.startShowTimers = function(usernames) {
    if (usernames === undefined || usernames === "") {
        console.log("usernames为空");
        return;
    }
    for (var i = 0; i < usernames.length; i++) {
        exports.startShowTimer(usernames[i]);
    }
};

/**
 * [startShowTimer 设置单个爬虫任务]
 * @param  {[type]} username [description]
 * @return {[type]}          [description]
 */
exports.startShowTimer = function(username) {
    forks.send(2, username);
};
exports.shutdown = function() {
    forks.shutdown();
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
