var dbmanager = require("./dbmanager.js");
dbmanager.connect();
// dbmanager.insertData();

// dbmanager.insertUser("rgh","123","121321313241331",function(err,user){
//
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log("user did saved");
// });

// dbmanager.findUsers({"username" : "renguohu"},function (error, users) {
//     console.log(users);
// });
// dbmanager.insertTask(userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice);
// dbmanager.insertTask("aaa","oppo","you@tudou.com","121313","laifeng",1243412131,300);
// userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice,hourUsePara,ctrPara,handler

// var timeStamp = (new Date()).getTime();
// dbmanager.insertSpiderdata("121321313241331","oppo","yuob@gmal.com","121341","Didi",timeStamp,80,500,67);
//


// dbmanager.findDefaltSpiderDataForForms("121321313241331",function(error,result){
//
//       // console.log(result);
//       console.log(result.showData.units[1]);
//
// });

// dbmanager.insertSpiderdata(dbmanager.createid(),"oppo","dhg@gmail.com","123455","fas",12134234234,400,10,666,999,null);

// dbmanager.insertTask('aaa', 'huawei', 'you@tudou.com', '121313', 'laifeng', 1243412131, 300,
//     (error, task) => {
//         console.log(`error : ${error}`);
//         console.log(`taks : ${task}`);
//     });

    function taskFilterWithParameters(userid, platformName, accountName,
      accountPassword, appName, dateTime, price) {
        const filter = {
            uid: userid,
            platform_name: platformName,
            account_name: accountName,
            account_password: accountPassword,
            app_name: appName,
            dt: dateTime,
            price: price,
        };
        return filter;
    }

let tasks = [taskFilterWithParameters('aaa', 'huawei', 'you@tudou.com', '121313', 'laifeng', 1243412131, 400),
    taskFilterWithParameters('aaa', 'oppo', 'you@tudou.com', '121313', 'laifeng', 1243412131, 500)];
// dbmanager.removeTasks(tasks, (error, result) => {
//     console.log(`result : ${result}`);
//     console.log(`error : ${error}`);
// });
dbmanager.saveTasks(tasks, (error, data) => {
    console.log(`data : ${data}`);
    console.log(`error : ${data}`);
});
