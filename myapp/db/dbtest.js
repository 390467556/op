var dbmanager = require("./dbmanager.js");
dbmanager.connect();
// dbmanager.insertData();

dbmanager.insertUser("wangzheHarray","123456",1212242343242,function(err,user){

    if(err){
        console.log(err);
        return;
    }
    console.log("user did saved");
});
