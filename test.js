var dbmanager = require('../../db/dbmanager');
var fs = require('fs');
var config = require('./config');
var timerManager = require('./timerManager');
// console.log(config.captchaUser.username);
// console.log(config.captchaUser.pwd);
dbmanager.connect();
// dbmanager.insertUser('wangzhe', '123456', 1001, function() {
//     console.log("插入成功");
//     dbmanager.findUsers('wangzhe', function(err, data) {
//         console.log(data);
//     });
// });
// 58aaf3c4bb0e23333465e674
var nowTime = new Date().getTime() + 10000;
//
// dbmanager.findSpiderDatas({
//         "account_name": "aa",
//         "app_name": "aa"
//     }, function(error, data) {
//         if (data === undefined || data.length === 0){
//           console.log("data == null");
//         }
//     });

// var filename = "./wangzhe1487646900622/checkCode.jpg";
// fs.stat(filename, function(err, stats) {
//     if (err) {
//         throw err;
//     } else {
//         console.log("filename_size=" + stats.size);
//     }
// });

var uid;


dbmanager.findUsers({
    "username": 'wangzhe1'
}, function(error, data) {
    uid = data[0].uid;
    dbmanager.findOneTask({
        "uid": uid
    }, function(error, data) {
        // if (data === undefined || data === null) {
        dbmanager.insertTask(uid, "oppo", "wwmeng@tudou.com", "Ifeng888!", "来疯直播", nowTime, 6.4, function(error, data) {
            console.log("插入设置出价task:" + data);
            console.log("task:" + data.task_id);
            // timerManager.startPrestTimer(data.task_id);
            dbmanager.insertTask(uid, "oppo", "wwmeng@tudou.com", "Ifeng888!", "来疯直播", nowTime + 20000, 6.4, function(error, data) {
                console.log("插入设置出价task:" + data);
                console.log("task:" + data.task_id);
                // timerManager.startPrestTimer(data.task_id);
                dbmanager.findTask({
                    'uid': uid
                }, function(error, data) {
                    console.log("task length = " + data.length);
                    var taskids = new Array(2);
                    for (var i = 0; i < data.length; i++) {
                      console.log("taskid = " + data[i].task_id);
                        taskids[i] = data[i].task_id;
                    }
                    console.log("taskids=" + taskids);
                    timerManager.startPrestTimers(taskids);
                });
            });
        });
    });


    // }else{
    // console.log("查询task:" + data);
    // account_username = data.account_name;
    // account_password = data.account_password;
    // platform_name = data.platform_name;
    // app_name = data.app_name;
    // console.log(account_username);
    // console.log(account_password);
    // console.log(platform_name);
    // console.log(app_name);
    // }
});





// dbmanager.insertTask("1001","oppo","wwmeng@tudou.com","Ifeng888!","来疯直播",nowTime,6.4,function(error,data){
//     console.log("插入设置出价task:" + data);
//     console.log("task:" + data[0].task_id);
// });

// dbmanager.findOneTask({"task_id":'58aba9c211efdb394a404093'},function(error,data){
//     console.log("查询预设置出价task:" + data);
// });
//
// dbmanager.insertSpiderTask("1001","oppo","wwmeng@tudou.com","Ifeng888!",function(error,data){
//    console.log("插入爬虫task:" + data);
// });


//
// dbmanager.insertSpiderdata("1001","oppo","wwmeng@tudou.com","Ifeng888!","来疯直播",nowTime,1,1,1,function(error,data){
//     console.log("插入爬虫数据成功:" + data);
// });
//
// dbmanager.findSpiderDatas({"uid":'1001'},function(error,data){
//   console.log("查询爬虫data:" + data);
// });



// dbmanager.insertUser_platform_account('1001','58aada6c0de24d31c1bd152e','58aada6c0de24d31c1bd152e',function(error,data){
//     console.log("data=" + data);
// });

// dbmanager.findPlatformAccountsWithUsername('wangzhe', function(error, data) {
//     dbmanager.findAccountWithId(data[0].account_id, function(error, data) {
//         console.log(data);
//         account_username = data[0].account_username;
//         account_password = data[0].account_password;
//         console.log(account_username);
//         console.log(account_password);
//     });
// });

// dbmanager.insertAccount("wwmeng@tudou.com","Ifeng888!","58aada6c0de24d31c1bd152e",function(error,data){
//     console.log("data=" + data);
//     console.log("error=" + error);
// });
//
//
// dbmanager.findAccountWithId('58aada6c0de24d31c1bd152e',function(error,data){
//     console.log("data=" + data);
// });
//
// dbmanager.savePlatformAccount('58aada6c0de24d31c1bd152e','58aada6c0de24d31c1bd152e','1001',function(error,data){
//     console.log("data=" + data);
// });



// dbmanager.saveTask("oppo","wwmeng@tudou.com","Ifeng888!", "来疯直播", nowTime, 6.6, function(error, data) {
//     console.log("error:" + error);
//     console.log("data:" + data);
// });
//
// dbmanager.findTasksWithId('58aac1a649832930c8cbfb56',function(error,data){
//     console.log(data[0]);
// });

// //根据username获取广告平台user
//
//
// //insertShowdata(username，platform_id,hourUse,ctr,price)  爬虫设置数据
//
//
// //根据taskid获取task
//   getTask(taskid)  返回任务列表 task最好加个status状态，是否成功
//
// //预设置执行成功(像对应task里插入状态），可能成功可能失败
//   setTaskResult(taskid,result) //result = 0成功，1失败(或者 success，fail字符串)
