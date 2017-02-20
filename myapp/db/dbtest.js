var dbmanager = require("./dbmanager.js");
dbmanager.connect();
// dbmanager.insertData();

// dbmanager.insertUser("wangzheHarray","123456",1212242343242,function(err,user){
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
dbmanager.insertTask("aaa","oppo","you@tudou.com","121313","laifeng",1243412131,300);
