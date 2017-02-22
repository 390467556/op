var express = require('express');
var router = express.Router();
var db = require('../db/dbmanager');
// db.connect();

// get用于获取登录页面
router.get('/', (req, res) => {
    res.render('login')
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
         db.findOneUser({"username" : username, "password" : password },function (err,user) {
           console.log("user " + user);
           if (!user) {
              res.render('login',{warn:"用户名或密码错误"});
           } else {
               req.session.username = username;
               db.findDefaltSpiderDataForFormsWithUsername(username,function(error,data){
                   var result = JSON.stringify(data);
                   console.log(result);
                   res.render('forms', {data: result});
               });

              // var result = JSON.stringify(formData());
              // res.render('forms', {data: result});
           }
         });
       }
    });

});


function formData() {
   return {
  "n": 3,
  "showData": {
    "appName": "Didi",
    "units": [
      [
        {
          "time": 1487437200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487440800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487444400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487448000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487451600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487455200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487458800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487462400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487466000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487469600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487473200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487476800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487480400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487484000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487487600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487491200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487494800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487498400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487502000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487505600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487509200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487512800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487516400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487520000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        }
      ],
      [
        {
          "time": 1487523600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487527200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487530800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487534400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487538000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487541600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487545200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487548800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487552400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487556000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487559600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487563200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487566800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487570400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487574000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487577600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487581200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487584800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487588400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487592000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487595600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487599200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487602800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487606400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        }
      ],
      [
        {
          "time": 1487610000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487613600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487617200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487620800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487624400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487628000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487631600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487635200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487638800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487642400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487647431647,
          "price": 300,
          "hourUse": 2000,
          "ctr": 5
        },
        {
          "time": 1487649600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487656013899,
          "price": 80,
          "hourUse": 500,
          "ctr": 67
        },
        {
          "time": 1487656800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487660400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487664000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487667600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487671200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487674800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487678400000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487682000000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487685600000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487689200000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        },
        {
          "time": 1487692800000,
          "price": 0,
          "hourUse": 0,
          "ctr": 0
        }
      ]
    ]
  }
}

}


module.exports = router;
