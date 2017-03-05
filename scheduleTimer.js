//每小时定时任务
var cron = require('node-schedule');
var index = require('./index');
var index1 = require('./index');
var Forks = require('fork-list');
var dbmanager = require('./myapp/db/dbmanager');
dbmanager.connect();

Forks.proc(function(data1, data2) {
    console.log('Work id:', this.workid, 'recv data1:', data1, 'recv data2:', data2);
    if (data1 === 1) {
        dbmanager.findTasksWithId(data2, function(error, data) {
            schedulePreset(data2, data[0]);
        });
    } else if (data1 === 2) {
        scheduleShow(data2);
    }
});

/**
 * [scheduleShow 设置每小时任务]
 * @param  {[type]} arg [description]
 * @return {[type]}     [description]
 */
function scheduleShow(arg) {

    console.log("参数=" + arg);
    if (arg === "" || arg === undefined) {
        console.log("参数为空");
        return;
    }

    var rule = new cron.RecurrenceRule();
    rule.minute = 57;
    cron.scheduleJob(rule, function() {
        console.log("定时任务开始--[每小事执行]--爬虫" + new Date().toLocaleString());
        index.login(2, arg);
        // forks.send(2, arg);
    });

}

/**
 * [schedulePreset 设置指定时间任务]
 * @param {[type]} arg  [taskid]
 * @param {[type]} data [task]
 */
function schedulePreset(arg, data) {
    if (data === undefined || data === "") {
        console.log("设置的taskdata数据为空");
        return;
    }
    var time = data.dt;
    var jobid = data.account_name + time;
    if (cron.scheduledJobs[jobid]) {
        var result = cron.cancelJob(jobid);
        console.log("cancel结果:" + result);
    }
    if (time < new Date().getTime()) {
        console.log("设置的task时间已经过期...");
        return;
    }
    console.log("参数=" + arg);
    if (arg === "" || arg === undefined) {
        console.log("参数为空");
        return;
    }

    // var time = timeUtil.formatTime(dt);
    //注意，月份0代表1月 月份要减一
    //修改时间
    console.log("time=" + time);
    var dt = new Date(time);
    var year = dt.getFullYear();
    var month = dt.getMonth();
    var day = dt.getDate();
    var hour = dt.getHours();
    var minute = dt.getMinutes();
    var second = dt.getSeconds();
    console.log("year=" + year + ",month=" + month + ",day=" + day + ",hour=" + hour + ",minute=" + minute + ",second=" + second);
    var date = new Date(year, month, day, hour, minute, second);
    console.log(date);
    var j = cron.scheduleJob(jobid, date, function() {
        console.log("定时任务开始--[指定时间执行]--预设置出价" + new Date().toLocaleString());
        index1.login(1, arg);
        j.cancel();
        // forks.send(1, arg);
    });

}


// forks.shutdown();
