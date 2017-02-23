// var timer = require('./presetTimer');
var timer2 = require('./scheduleTimer');
var dbmanager = require('../myapp/db/dbmanager');
var child_process = require('child_process');
var ForkList = require('fork-list');
var path = './scheduleTimer';
var num = 3;
var forks = new ForkList({
    path: path,
    num: num,
    log: true
});


var taskid = '58aba9c211efdb394a404093';
var username = "wangzhe";

//在前段页面点击设置后执行这个方法
// timer.schedule(taskid);
// timer2.scheduleShow(username);
// timer2.schedulePreset(taskid);
forks.send(1,taskid);
forks.send(2,username);


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
