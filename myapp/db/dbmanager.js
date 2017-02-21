
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
        task_id :{type : String},
        uid :{type : String},
        platform_name : {type : String},
        account_name :{type : String},
        account_password : {type : String},
        app_name : {type : String},
        dt:Number,
        price:Number,
        status:Boolean
});
var taskModel = db.model('Task',taskSchema);

function Task(taskid,userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice,sta){
    var task = new taskModel({
        task_id : taskid,
        uid :userid,
        platform_name : platformName,
        account_name : accountName,
        account_password : accountPassword,
        app_name : appName,
        dt:dateTime,
        price:settingPrice,
        status:sta
    });
    return task;
}


// 爬虫数据
var spiderdataSchema  = new mongoose.Schema({
        uid :{type : String},
        platform_name : {type : String},
        account_name :{type : String},
        account_password : {type : String},
        app_name : {type : String},
        dt:Number,
        price:Number,
        hourUse : Number,
        ctr : Number,
});
var spiderdataModel = db.model('Spiderdata',spiderdataSchema);

function Spiderdata (userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice,hourUsePara,ctrPara) {
      var spiderdata = new spiderdataModel({
        uid :userid,
        platform_name : platformName,
        account_name : accountName,
        account_password : accountPassword,
        app_name : appName,
        dt:dateTime,
        price:settingPrice,
        hourUse : hourUsePara,
        ctr : ctrPara
      });
      return spiderdata;
}

// 爬虫任务表 spider task
var spidertaskSchema  = new mongoose.Schema({
    uid :{type : String},
    platform_name : {type : String},
    account_name :{type : String},
    account_password : {type : String},
});

var spidertaskModel = db.model('spiderTask',spidertaskSchema);

function Spidertask (userid,platformName,accountName,accountPassword) {
      var spiderTask = new spidertaskModel({
        uid :userid,
        platform_name : platformName,
        account_name : accountName,
        account_password : accountPassword,
      });
      return spiderTask;
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
dbmanager.insertTask = function (userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice,sta,handler) {
     var filter = {
        "uid":userid,
        "platform_name" : platformName,
        "account_name" : accountName,
        "account_password" : accountPassword,
        "app_name" : appName,
        "dt" : dateTime,
        "price" : settingPrice,
     };
     this.findOneTask(filter,function(error,result){
          if (!result) {
            var task_id = this.createid();
            var task = Task(task_id,userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice,sta);
            task.save(handler);
          } else {
            result.price = settingPrice;
            result.save(handler);
          }
     });
};
//查询一个 task 数据
dbmanager.findOneTask = function (filter,handler) {
     if (!filter) {
        taskModel.findOne(handler);
     } else {
        taskModel.findOne(filter,handler);
     }
};
//查询多个 task 数据
dbmanager.findTask = function (filter,handler) {
     if (!filter) {
        taskModel.find(handler);
     } else {
        taskModel.find(filter,handler);
     }
};


// 插入爬虫展示数据
// accountid 用户平台账户 id
// pid 平台用户 id
// datetime 爬取数据的时间
// settingPrice 该时刻设置的 价格
// hourUsePara 当前该小时消耗
// ctrPara  ctr
dbmanager.insertSpiderdata = function (userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice,hourUsePara,ctrPara,handler) {
     var spiderData = Spiderdata(userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice,hourUsePara,ctrPara);
     spiderData.save(handler);
};

// 查询爬虫数据

dbmanager.findSpiderDatas = function (filter,handler) {
  if (!filter) {
    spiderdataModel.find(handler);
  } else {
    spiderdataModel.find(filter,handler);
  }
};

// 插入爬虫任务
dbmanager.insertSpiderTask = function (userid,platformName,accountName,accountPassword) {
    var spiderTask = SpiderTask(userid,platformName,accountName,accountPassword);
    spiderTask.save(handler);
};

dbmanager.createid  = function() {
   return mongoose.Types.ObjectId().toString();
};


/* 其它方法 */
dbmanager.promiseFindUser = function(username,handler){

  findPromise(userModel,{"username" : username}).then(function(result){
    // console.log(result);
    handler(null,result);
  },function(err){

    // console.log(err);
    handler(err,null);
  });

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


var saveInPromise = function (model) {

  var promise = new mongoose.Promise();

  model.save(function (err, result) {
    promise.resolve(err, result);
  });

  return promise;
};

var findPromise = function (model,filter) {

  var promise = new mongoose.Promise();

  model.find(filter, function (err, result) {
    promise.resolve(err, result);
  });

  return promise;
};

var findOnePromise = function (model,filter) {

  var promise = new mongoose.Promise();

  model.findOne(filter, function (err, result) {
    promise.resolve(err, result);
  });

  return promise;
};
