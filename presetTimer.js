var later = require('later');
var cron = require('node-schedule');
var index = require('./index');
  // var arg = process.argv[2];

exports.schedule = function(arg){
  // //设置本地时区
  later.date.localTime();

  console.log("参数:" + arg);
  if (arg === "" || arg === undefined){
    console.log("参数为空");
    return;
  }
  //注意，月份0代表1月 月份要减一
  var date = new Date(2017,1,18,17,16,0);
  var j = cron.scheduleJob(date, function(){
    console.log('现在时间：'+new Date()+"执行预设置脚本");
    index.login(1,arg);
  });
};
