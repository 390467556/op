var dbmanager = {};
module.exports = dbmanager;

var mongoose = require("mongoose");
var db = mongoose.connection;
db.on('error',console.error);

// 发布数据库的 UserModel
var userSchema  = new mongoose.Schema({
        username : {type : String},
        password : {type : String},
        uid : Number
});

var userModel = db.model('User',userSchema);




dbmanager.connect = function(){
  mongoose.connect('mongodb://localhost/test');
};

dbmanager.insertUser = function (name,pwd,userId) {

     var user = this.dbUserWithParameters(name,pwd,userId);
     user.save(function (err,user) {
        if (err) {
            console.log(err);
        }
        console.log("user did saved");
     });
};


dbmanager.dbUserWithParameters = function (name,pwd,userId) {
      var user = new userModel({
           username : name,
           password : pwd,
           uid : userId
      });
      return user;
};

// dbmanager.userSchema  = new mongoose.Schema({
//         username : {type : String},
//         password : {type : String},
//         uid : Number
// });

dbmanager.UserModel = db.model('User',this.userSchema);




dbmanager.insertData = function () {
  db.once('open',function(){
      //在这里创建你的模式和模型
    var movieSchema = new mongoose.Schema({
        title: {type: String},
        rating: String,
        releaseYear: Number,
        hasCreditCookie: Boolean
     });

    var movieModel = db.model('Movie',movieSchema);

    var thor = new movieModel({
       title: 'Thor',
       rating: 'PG-13',
       releaseYear: '2011',   //注意我们在这里使用一个字符串而不是一个数字 -- Mongoose会为我们自动转换
       hasCreditCookie: true
    });

    thor.save(function(err,thor){
      if(err) return console.log(err);
      console.dir(thor);
    });

  });
};
