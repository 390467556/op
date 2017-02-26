
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
        task_id :{type : String },
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
        dayBudget:Number,
        use_num :Number,
});
var spiderdataModel = db.model('Spiderdata',spiderdataSchema);

function Spiderdata (userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice,hourUsePara,ctrPara,dayBudget,use_num) {
      var spiderdata = new spiderdataModel({
        uid :userid,
        platform_name : platformName,
        account_name : accountName,
        account_password : accountPassword,
        app_name : appName,
        dt:dateTime,
        price:settingPrice,
        hourUse : hourUsePara,
        ctr : ctrPara,
        dayBudget : dayBudget,
        use_num : use_num
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

var spidertaskModel = db.model('Spidertask',spidertaskSchema);

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

// 查询用户数据
dbmanager.findOneUser = function (filter,handler) {
  if (!filter) {
    handler("error,filter is null","error,filter is null");
  } else {
    userModel.findOne(filter,handler);
  }
};

dbmanager.findOneUserWithUsername = function (username,handler) {
  if (!username) {
      handler("error,username is null","error,username is null");
  } else {
    userModel.findOne({"username" : username},handler);
  }
};

function taskFilterWithParameters(userid, platformName, accountName,
  accountPassword, appName, dateTime) {
    const filter = {
        uid: userid,
        platform_name: platformName,
        account_name: accountName,
        account_password: accountPassword,
        app_name: appName,
        dt: dateTime,
    };
    return filter;
}

// 插入 task 数据
dbmanager.insertTask = function insertTask(userid, platformName,
  accountName, accountPassword, appName, dateTime, settingPrice, handler) {
    const filter = taskFilterWithParameters(userid, platformName, accountName,
      accountPassword, appName, dateTime);
    const update = { price: settingPrice };
    this.findOneTaskAndUpdate(filter, update, handler);
};

dbmanager.findOneTaskAndUpdate = function findOneTaskAndUpdate(filter, update, handler) {
    const updateAndInsertData = update;
    updateAndInsertData.$setOnInsert = { task_id: this.createid(), status: false };
    taskModel.findOneAndUpdate(filter, update, { upsert: true, new: true }, handler);
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

dbmanager.updateTaskStatus = function(taskId, status,handler){

  this.findOneTask({"task_id" : taskId},function(error,result){
       if (!result) {
         handler("error,do not have the task","error, do not have the task");
       } else {
         result.status  = status;
         result.save(handler);
       }
  });
};

function allDataTaskWithOriginTask(task) {
    const allDataTask = {
        uid: task.uid,
        platform_name: task.platform_name,
        account_name: task.account_name,
        account_password: task.account_password,
        app_name: task.app_name,
        dt: task.dt,
        price: task.price,
        status: false,
        task_id: dbmanager.createid(),
    };
    return allDataTask;
}

function noPriceTaskWithOriginTask(task) {
    const noPriceTask = {
        uid: task.uid,
        platform_name: task.platform_name,
        account_name: task.account_name,
        account_password: task.account_password,
        app_name: task.app_name,
        dt: task.dt,
    };
    return noPriceTask;
}
// 批量插入任务数据
dbmanager.saveTasks = function saveTasks(tasks, handler) {
    const noPriceTasks = [];
    const currentTasks = [];
    tasks.forEach((value, index, array) => {
        noPriceTasks.push(noPriceTaskWithOriginTask(value));
        currentTasks.push(allDataTaskWithOriginTask(value));
    });
    this.removeTasks(noPriceTasks, (error, data) => {
        taskModel.collection.insert(currentTasks, handler);
    });
};

dbmanager.removeTasks = function removeTasks(tasks, handler) {
    taskModel.remove({ $or: tasks }, handler);
};

// 插入爬虫展示数据
// accountid 用户平台账户 id
// pid 平台用户 id
// datetime 爬取数据的时间
// settingPrice 该时刻设置的 价格
// hourUsePara 当前该小时消耗
// ctrPara  ctr
dbmanager.insertSpiderdata = function (userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice,hourUsePara,ctrPara,dayBudget,useNum,handler) {
     var spiderData = Spiderdata(userid,platformName,accountName,accountPassword,appName,dateTime,settingPrice,hourUsePara,ctrPara,dayBudget,useNum);
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
dbmanager.insertSpiderTask = function (userid,platformName,accountName,accountPassword,handler) {
    var spiderTask = Spidertask(userid,platformName,accountName,accountPassword);
    spiderTask.save(handler);
};

dbmanager.createid  = function() {
   return mongoose.Types.ObjectId().toString();
};

dbmanager.findSpiderDataForForms = function findSpiderDataForForms(username, start, end, handler) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1);
    const formData = {};
    const showData = {};
    const days = ((endDate.getTime() - startDate.getTime()) / (60 * 60 * 24 * 1000)) ;
    this.findOneUserWithUsername(username, (error, user) => {
        if (!user) {
            handler('error,user is not exist', 'error,user is not exist');
            return;
        }
        spiderdataModel.findOne({ uid: user.uid }, (err, spiderData) => {
            if (!spiderData) {
                handler('error,do not have any data', 'do not have any data');
                return;
            }
            const appName = spiderData.app_name;
            if (!appName) {
                handler('error,do not have any app', 'do not have any app');
                return;
            }
            formData.n = days;
            showData.appName = appName;
            spiderdataModel.find({ uid: spiderData.uid,
                dt: { $gte: startDate.getTime(), $lt: endDate.getTime() } }, (findError, data) => {
                const units = convertSpiderDataToFormsData(startDate, endDate, data);
                showData.units = units;
                formData.showData = showData;
                handler(error, formData);
            });
        });
    });
};


dbmanager.findDefaltSpiderDataForFormsWithUsername = function(username,handler){
    this.findOneUserWithUsername(username,function(error,user){
      if (!user) {
         handler("error,user is not exist","error,user is not exist");
         return;
      }
      dbmanager.findDefaltSpiderDataForFormsWithUid(user.uid,handler);
    });
};

// 返回给报表页面使用的数据

dbmanager.findDefaltSpiderDataForFormsWithUid = function(uid,handler){

   if (!uid) {
      handler("error!","uid is null");
      return;
   }
    var formData = {};
    var showData = {};
   spiderdataModel.findOne({"uid" : uid},function(error,spiderData){
      // console.log("spiderData" + spiderData);
      if (!spiderData) {
        handler("error,do not have any data","do not have any data");
        return;
      }
      var appName = spiderData.app_name;
      if (!appName) {
        handler("error,do not have any app","do not have any app");
        return;
      }
      formData.n = 3;
      showData.appName = appName;
      var theDayBeforeYestoday = new Date();
      var day = theDayBeforeYestoday.getDate();
      theDayBeforeYestoday.setDate(day - 2);
      theDayBeforeYestoday.setHours(0);
      theDayBeforeYestoday.setMinutes(0);
      theDayBeforeYestoday.setSeconds(0);
      theDayBeforeYestoday.setMilliseconds(0);

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0);
      tomorrow.setMinutes(0);
      tomorrow.setSeconds(0);
      tomorrow.setMilliseconds(0);
      timestampBefore = theDayBeforeYestoday.getTime();
      timeStampAfter = tomorrow.getTime();

      // console.log(spiderData);
      // console.log(timestampBefore);
      // console.log(timeStampAfter);

       spiderdataModel.find({ uid: spiderData.uid,
           dt: { $gte: timestampBefore, $lt: timeStampAfter }},function(error,data){

          var units = convertSpiderDataToFormsData(theDayBeforeYestoday,tomorrow,data);
          showData.units = units;
          formData.showData = showData;
          // console.log(units);
          handler(error,formData);
      });
   });

};

dbmanager.convertSpiderDataToFormsData = convertSpiderDataToFormsData;

function convertSpiderDataToFormsData(startDate,endDate,spiderArray){

  var dateSpider = {};
  spiderArray.forEach(function(value,index,array){
     var spiderData = value;
     var date = new Date(spiderData.dt);
     date.setMinutes(0);
     date.setSeconds(0);
     date.setMilliseconds(0);
     var timestamp = date.getTime();
     if (!dateSpider[timestamp]) {
        dateSpider[timestamp] = spiderData;
     }
  });
  // console.log(dateSpider);

  var start = new Date(startDate);
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);

  var end = new Date(endDate);

  end.setHours(0);
  end.setMinutes(0);
  end.setSeconds(0);
  end.setMilliseconds(0);

  var startTimestamp = start.getTime();
  var endTimestamp = end.getTime();
  // console.log("start " +  startTimestamp);
  // console.log("end  " +  endTimestamp);

  var days = (endTimestamp - startTimestamp) / (60 * 60 * 24 * 1000) ;
  var currentTimestamp = startTimestamp;
  var timeStampArray = [];
  var result = [];
  for (var count = 0; count < days; count ++) {
      var dayArray = [];
      for (var hour = 1; hour <= 24; hour ++) {
         currentTimestamp = currentTimestamp +  60 * 60 * 1000;
         timeStampArray.push(currentTimestamp);
         var currentTimestampString = currentTimestamp + "";
        //  console.log(currentTimestampString);
         var resultSpider =  dateSpider[currentTimestampString];
         var unit;
         if (resultSpider) {

             unit = {"time" : resultSpider.dt,
                      "price":resultSpider.price,
                      "hourUse":resultSpider.hourUse,
                      "ctr":resultSpider.ctr};
             dayArray.push(unit);
         } else {
             unit = {"time" : currentTimestamp,
                      "price":0,
                      "hourUse":0,
                      "ctr":0};
             dayArray.push(unit);
         }
      }
      result.push(dayArray);
  }
    // console.log(result);
    return result;
}

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

dbmanager.findTasksWithId = function(taskid,handler){

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
