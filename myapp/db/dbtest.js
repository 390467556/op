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
dbmanager.insertTask("1","2","3","4","5",function(error,tasks){
   console.log(error);
   console.log(tasks);
});
