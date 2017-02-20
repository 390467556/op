
var dbmanager = {};
module.exports = dbmanager;

var mongoose = require("mongoose");
var db = mongoose.connection;
db.on('error',console.error);

// 用户信息
var userSchema  = new mongoose.Schema({
        username : {type : String},
        password : {type : String},
        uid : {type : String}
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
        account_id :{type : String},
        platform_id : {type : String},
        app_id :{type : String},
        dt : Number,
        price : Number,
        task_id:{type : String},
});
var taskModel = db.model('Task',taskSchema);

function dbTaskWithParameters (accountid,pid,appid,datetime,settingPrice,taskid) {

      var task = new taskModel({
        account_id : accountid,
        platform_id : pid,
        app_id : appid,
        dt : datetime,
        price : settingPrice,
        task_id : taskid
      });
      return task;
}

// 爬虫数据
var showdataSchema  = new mongoose.Schema({
        acount_id : {type : String},
        platform_id : {type : String},
        app_id : {type : String},
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
        acount_id : {type : String},
        platform_id : {type : String},
        uid : {type : String},
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
        platform_id : {type : String},
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
        account_id : {type : String},
});

var accountModel = db.model('Account',accountSchema);

function dbAccountWithParameters (name,pwd,id) {
      var account = new accountModel({
           acount_username : name,
           account_password : pwd,
           account_id : {type : String},
      });
      return account;
}

// app 数据

var appSchema = new mongoose.Schema({
        app_name : {type : String},
        app_id : {type : String},
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
        uid : {type : String},
        platform_id : {type : String},
        account_id : {type : String},
        app_id : {type : String},
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

var user_platform_accountSchema = new mongoose.Schema({
        uid : {type : String},
        platform_id : {type : String},
        account_id : {type : String},
});

var user_platform_accountModel = db.model('User_platform_account',user_platform_accountSchema);

function dbUser_platform_account_WithParameters (userid,pid,accountid) {
      var user_platform_account = new user_platform_account_appModel({
          uid : userid,
          platform_id : pid,
          account_id : accountid
      });
      return user_platform_account;
}




//数据库连接
dbmanager.connect = function(){
  mongoose.connect('mongodb://localhost/test');
};

// 插入用户数据
dbmanager.insertUser = function (name,pwd,userId,handler) {

     var user = dbUserWithParameters(name,pwd,userId);
     user.save(handler);
};

// 查询用户数据
dbmanager.findUsers = function (filter,handler) {
  if (!filter) {
    userModel.find(handler);
  } else {
    userModel.find(filter,handler);
  }
};


// 插入 task 数据
dbmanager.insertTask = function (pid,accountid,appid,datetime,settingPrice,handler) {
     var task_id = this.createid();
     var task = dbTaskWithParameters(accountid,pid,appid,datetime,settingPrice,task_id);
     task.save(handler);
};

// 插入爬虫展示数据
// accountid 用户平台账户 id
// pid 平台用户 id
// datetime 爬取数据的时间
// settingPrice 该时刻设置的 价格
// hourUsePara 当前该小时消耗
// ctrPara  ctr
dbmanager.insertShowdata = function (accountid,pid,appid,datetime,settingPrice,hourUsePara,ctrPara,handler) {
     var showdata = dbShowdataWithParameters(accountid,pid,appid,datetime,settingPrice,hourUsePara,ctrPara);
     showdata.save(handler);
};

// 查询展示数据

dbmanager.findSpiderDatas = function (filter,handler) {
  if (!filter) {
    showdataModel.find(handler);
  } else {
    showdataModel.find(filter,handler);
  }
};


// 插入 广告平台数据
dbmanager.insertPlatform = function (name,id,handler) {
     var platform = dbPlatformWithParameters(name,id);
     platform.save(handler);
};

// 插入 app 数据
dbmanager.insertApp = function (name,id,handler) {
     var app = dbAppWithParameters(name,id);
     app.save(handler);
};

// 插入用户广告平台账号数据
dbmanager.insertAccout = function (name,pwd,id,handler) {
     var account = dbAccountWithParameters(name,pwd,id);
     account.save(handler);
};

// 插入关系表
dbmanager.insertUser_platform_account_app = function (userid,pid,accountid,appid,handler) {
     var user_platform_account_app = dbUser_platform_account_appWithParameters(userid,pid,accountid,appid);
     user_platform_account_app.save(handler);
};

dbmanager.insertUser_platform_account = function (userid,pid,accountid,handler) {
     var user_platform_account = dbUser_platform_account_appWithParameters(userid,pid,accountid);
     user_platform_account.save(handler);
};



dbmanager.createid  = function() {
   return mongoose.Types.ObjectId().toString();
};


// 爬虫数据便利插入方法

dbmanager.insertSpiderData = function (username,platformname) {


};

dbmanager.saveTask = function(platformName,accountName,accountPassword,appName,dt,price,handler){

     var pid = this.createid();
     var accountid = this.createid();
     var appid = this.createid();
     this.insertTask(accountid,pid,appid,dt,price,handler);
     this.insertPlatform(platformName,pid,handler);
     this.insertAccout(accountName,accountPassword,accountid,handler);
     this.insertApp(appName,appid,handler);
};



dbmanager.findPlatformAccountsWithUsername = function(username,handler) {
    if (!username) {
        handler("error","username is null");
    } else {
       user_platform_accountModel.find({"username" : username },handler);
    }
};

dbmanager.findTaskWithId = function(taskid,handler){

  if (!taskid) {
      handler("error","taskid is null");
  } else {
     taskModel.find({"task_id" : taskid },handler);
  }
};

// dbmanager.dbUserWithParameters = function (name,pwd,userId) {
//       var user = new userModel({
//            username : name,
//            password : pwd,
//            uid : userId
//       });
//       return user;
// };
