var express = require('express');
var router = express.Router();
var db = require('../db/dbmanager');
// db.connect();

// get用于获取登录页面
router.get('/', (req, res) => {
    res.render('login', {warn: 'test'})
})

// post用于登录
router.post('/', (req, res) => {
    // 校验合法性
    var username = req.body.username;
    var password = req.body.pwd;
    db.findUsers({"username" : username},function (err,users) {
       if (users.length === 0) {
          res.render('login',{warn:"该用户不存在"});
       } else {
         db.findUsers({"username" : username, "password" : password },function (err,users) {
           if (users.length === 0) {
              res.render('login',{warn:"用户名或密码错误"});
           } else {
               db.findDefaltSpiderDataForForms("121321313241331",function(error,data){
                   var result = JSON.stringify(data);
                   console.log(result);
                   res.render('forms', {data: result});
               });
           }
         });
       }
    });

});


function formData() {
  var tmparr = []
  for (var i = 0; i < 24; i++)
    tmparr.push([{"time" : 2016010101,
            "price":2,
            "hourUse":4,
            "ctr":5
          },{"time" : 2016010101,
            "price":2,
            "hourUse":4,
            "ctr":5
          },{"time" : 2016010101,
            "price":2,
            "hourUse":4,
            "ctr":5
          }])
   return {
    "showData": {
        "units": tmparr,
      "appName": "laifeng"
    },
  "n": 3
  }
}


module.exports = router;
