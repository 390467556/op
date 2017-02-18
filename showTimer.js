//每小时定时任务
var later = require('later');
var cron = require('node-schedule');
var index = require('./index');
// var arg = process.argv[2];

exports.schedule = function(arg){

  console.log("参数="+arg);
  if (arg === "" || arg === undefined){
    console.log("参数为空");
    return;
  }

  // //设置本地时区
  later.date.localTime();

  var rule =new cron.RecurrenceRule();
  rule.second = 0;
  cron.scheduleJob(rule,function(){
    console.log(new Date(),"任务执行--每小时执行--爬虫");
    index.login(2,arg);
  });

};
