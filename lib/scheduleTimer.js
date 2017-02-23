//每小时定时任务
var cron = require('node-schedule');
var index = require('./index');
var index1 = require('./index');
var Forks = require('fork-list');
Forks.proc(function(data1, data2) {
    console.log('Work id:', this.workid, 'recv data1:', data1,'recv data2:', data2);
    if (data1 === 1){
       schedulePreset(data2);
    } else if(data1 === 2){
       scheduleShow(data2);
    }
});

function scheduleShow(arg) {

    console.log("参数=" + arg);
    if (arg === "" || arg === undefined) {
        console.log("参数为空");
        return;
    }

    var rule = new cron.RecurrenceRule();
    rule.second = 0;
    cron.scheduleJob(rule, function() {
        console.log(new Date(), "定时任务开始--[每分钟执行]--爬虫");
        index.login(2, arg);
        // forks.send(2, arg);
    });

}
function schedulePreset(arg) {
    console.log("参数=" + arg);
    if (arg === "" || arg === undefined) {
        console.log("参数为空");
        return;
    }
    //注意，月份0代表1月 月份要减一
    //修改时间
    var date = new Date(2017, 1, 22, 22, 17, 0);
    var j = cron.scheduleJob(date, function() {
        console.log(new Date(), "定时任务开始--[指定时间执行]--预设置出价");
        index1.login(1, arg);
        // forks.send(1, arg);
    });

}


// forks.shutdown();
