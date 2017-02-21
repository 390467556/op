var cron = require('node-schedule');
var index = require('./index');
  // var arg = process.argv[2];
var action = 1;

exports.schedule = function(arg){

  console.log("参数:" + arg);
  if (arg === "" || arg === undefined){
    console.log("参数为空");
    return;
  }
  //注意，月份0代表1月 月份要减一
  //修改时间
  var date = new Date(2017,1,21,16,24,10);
  var j = cron.scheduleJob(date, function(){
    console.log('现在时间：'+new Date()+"执行预设置脚本");
    index.login(action,arg);
  });

  index.on('login_fail',function(){
    console.log("收到失败消息，重新执行任务.....");
    index.login(action,arg);
  });

};
