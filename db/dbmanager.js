
var dbmanager = {};
module.exports = dbmanager;

var mongoose = require("mongoose");
var db = mongoose.connection;
db.on('error',console.error);

// 用户信息
var userSchema  = new mongoose.Schema({
        username : {type : String},
        password : {type : String},
        uid : Number
});
var userModel = db.model('User',userSchema);

function dbUserWithParameters (name,pwd,userId) {
      var user = new userModel({
           username : name,
           password : pwd,
           uid : userId
      });
      return user;
}

// 任务 task

var taskSchema  = new mongoose.Schema({
        account_id : Number,
        platform_id : Number,
        app_id : Number,
        dt : Number,
        price : Number,
});
var taskModel = db.model('Task',taskSchema);

function dbTaskWithParameters (accountid,pid,appid,datetime,settingPrice) {
      var task = new taskModel({
        account_id : accountid,
        platform_id : pid,
        app_id : appid,
        dt : datetime,
        price : settingPrice,
      });
      return task;
}

// 爬虫数据
var showdataSchema  = new mongoose.Schema({
        acount_id : Number,
        platform_id : Number,
        app_id : Number,
        dt : Number,
        price : Number,
        hourUse : Number,
        ctr : Number,
});
var showdataModel = db.model('Showdata',showdataSchema);

function dbShowdataWithParameters (accountid,pid,appid,datetime,settingPrice,hourUsePara,ctrPara) {
      var showdata = new showdataModel({
        account_id : accountid,
        platform_id : pid,
        app_id : appid,
        dt : datetime,
        price : settingPrice,
        hourUse : hourUsePara,
        ctr : ctrPara
      });
      return showdata;
}

// 爬虫任务表 spider task
var spidertaskSchema  = new mongoose.Schema({
        acount_id : Number,
        platform_id : Number,
        uid : Number
});

var spidertaskModel = db.model('spiderTask',spidertaskSchema);

function dbSpiderTaskWithParameters (accountid,pid,userid) {
      var spiderTask = new spidertaskModel({
        account_id : accountid,
        platform_id : pid,
        uid : userid
      });
      return spiderTask;
}


// 广告平台数据

var platformSchema =  new mongoose.Schema({
        platform_name : {type : String},
        platform_id : Number
});

var platformModel = db.model('Platform',platformSchema);

function dbPlatformWithParameters (name,id) {
      var platform = new platformModel({
           platform_name : name,
           platform_id : id,
      });
      return platform;
}

// 用户广告平台账户信息

var accountSchema =  new mongoose.Schema({
        acount_username : {type : String},
        account_password : {type : String},
        account_id : Number
});

var accountModel = db.model('Account',accountSchema);

function dbAccountWithParameters (name,pwd,id) {
      var account = new accountModel({
           acount_username : name,
           account_password : pwd,
           account_id : Number
      });
      return account;
}


// app 数据

var appSchema = new mongoose.Schema({
        app_name : {type : String},
        app_id : Number
});

var appModel = db.model('App',appSchema);

function dbAppWithParameters (name,id) {
      var app = new appModel({
           app_name  : name,
           app_id : id,
      });
      return app;
}


// 关系表

var user_platform_account_appSchema = new mongoose.Schema({
        uid : Number,
        platform_id : Number,
        account_id : Number,
        app_id : Number
});

var user_platform_account_appModel = db.model('User_platform_account_app',user_platform_account_appSchema);

function dbUser_platform_account_appWithParameters (userid,pid,accountid,appid) {
      var user_platform_account_app = new user_platform_account_appModel({
          uid : userid,
          platform_id : pid,
          account_id : accountid,
          app_id : appid
      });
      return user_platform_account_app;
}

//数据库连接
dbmanager.connect = function(){
  mongoose.connect('mongodb://localhost/test');
};

// 插入用户数据
dbmanager.insertUser = function (name,pwd,userId,handle) {

     var user = dbUserWithParameters(name,pwd,userId);
     user.save(handle);
};

// 插入 task 数据
dbmanager.insertTask = function (accountid,pid,appid,datetime,settingPrice) {
     var task = dbTaskWithParameters(accountid,pid,appid,datetime,settingPrice);
     task.save(handle);
};

// 插入展示数据
dbmanager.insertShowdata = function (accountid,pid,appid,datetime,settingPrice,hourUsePara,ctrPara) {
     var showdata = dbShowdataWithParameters(accountid,pid,appid,datetime,settingPrice,hourUsePara,ctrPara);
     showdata.save(handle);
};


// 插入 广告平台数据
dbmanager.insertPlatform = function (name,id) {
     var platform = dbPlatformWithParameters(name,id);
     platform.save(handle);
};

// 插入 app 数据
dbmanager.insertApp = function (name,id) {
     var app = dbAppWithParameters(name,id);
     app.save(handle);
};

// 插入用户广告平台账号数据
dbmanager.insertAccout = function (name,pwd,id) {
     var account = dbAccountWithParameters(name,pwd,id);
     account.save(handle);
};

// 插入关系表
dbmanager.insertUser_platform_account_app = function (userid,pid,accountid,appid) {
     var user_platform_account_app = dbUser_platform_account_appWithParameters(name,pwd,id);
     user_platform_account_app.save(handle);
};



// dbmanager.dbUserWithParameters = function (name,pwd,userId) {
//       var user = new userModel({
//            username : name,
//            password : pwd,
//            uid : userId
//       });
//       return user;
// };
