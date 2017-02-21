//每小时定时任务
var cron = require('node-schedule');
var index = require('./index');
var action = 2;

exports.schedule = function(arg) {

    console.log("参数=" + arg);
    if (arg === "" || arg === undefined) {
        console.log("参数为空");
        return;
    }

    var rule = new cron.RecurrenceRule();
    rule.second = 0;
    cron.scheduleJob(rule, function() {
        console.log(new Date(), "任务执行--每小时执行--爬虫");
        index.login(action, arg);
    });

    index.on('fail', function() {
        console.log("收到失败消息，重新执行任务.....");
        index.login(action, arg);
    });

};
