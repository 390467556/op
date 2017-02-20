var dbmanager = require('../myapp/db/dbmanager');

dbmanager.connect();
// dbmanager.insertUser('wangzhe', '123456', 1001, function() {
//     console.log("插入成功");
//     dbmanager.findUsers('wangzhe', function(err, data) {
//         console.log(data);
//     });
// });

var nowTime = new Date().getTime();

// dbmanager.insertUser_platform_account('1001','58aada6c0de24d31c1bd152e','58aada6c0de24d31c1bd152e',function(error,data){
//     console.log("data=" + data);
// });

dbmanager.findPlatformAccountsWithUsername('wangzhe', function(error, data) {
    dbmanager.findAccountWithId(data[0].account_id, function(error, data) {
        console.log(data);
        account_username = data[0].account_username;
        account_password = data[0].account_password;
        console.log(account_username);
        console.log(account_password);
    });
});

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
// dbmanager.findTaskWithId('58aac1a649832930c8cbfb56',function(error,data){
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
