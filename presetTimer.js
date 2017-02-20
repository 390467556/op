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
  var date = new Date(2017,1,18,17,16,0);
  var j = cron.scheduleJob(date, function(){
    console.log('现在时间：'+new Date()+"执行预设置脚本");
    index.login(action,arg,arg + new Date().getTime());
  });

  index.on('login_fail',function(){
    console.log("收到登录失败，重新执行任务.....");
    index.login(action,arg,arg + new Date().getTime());
  });

};
