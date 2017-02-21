var dbmanager = require("./dbmanager.js");
dbmanager.connect();
// dbmanager.insertData();

dbmanager.insertUser("rgh","123","121321313241331",function(err,user){

    if(err){
        console.log(err);
        return;
    }
    console.log("user did saved");
});

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
