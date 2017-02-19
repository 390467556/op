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
         db.findUsers({"username" : username, "password" : password },function (err,users) {
           if (users.length === 0) {
              res.render('login',{warn:"用户名或密码错误"});
           } else {
<<<<<<< HEAD:myapp/routes/loginRoute.js
             res.render('forms', {n: 3, forms: {"app_name": 'test'}, units: []});
=======
             console.log(users);
               res.render('forms', formData());
              // res.send("<center><h1>登录成功<h1></center>");
>>>>>>> 8abbbd42355a54edd6515e403373651082a2ec64:myapp/routes/login.js
           }
         });
       }
    });

});

function formData() {
   var data = {
      "n" : 3,
<<<<<<< HEAD:myapp/routes/loginRoute.js
      "forms" : {app_name: 'test'}
=======
      "form" : {}
>>>>>>> 8abbbd42355a54edd6515e403373651082a2ec64:myapp/routes/login.js
   };
   return data;
}


module.exports = router;
