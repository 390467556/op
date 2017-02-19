var express = require('express');
var router = express.Router();
var db = require('../db/dbmanager');
// db.connect();

// 获取注册页面
router.get('/', (req, res) => {
    res.render('register', {warn: undefined})
});

// 校验注册合法,用户名重复
router.post('/', (req, res) => {
  console.log(req.body);
    var username = req.body.username;
    db.findUsers({ "username": username}, (err, users) => {
        console.log("db did select");
        if (err) {
            console.log("Failed to findUser, username is ", username);
            res.render('register', {warn: "网络忙，请重试"});
            return;
        }
        if (users.length === 0) {
            // userid
            var userid = db.createid();
            console.log("password " + req.body.pwd);
            db.insertUser(username, req.body.pwd, userid, (err, user) => {
                if (err) {
                    console.log("Failed to insert user, username is " + username + "\nerror is :" + err);
                    res.render('register', {warn: "网络忙，请重试"});
                } else {
                    res.render('config');

                }
            })
        } else {
            res.render('register', {warn: "重复用户"});
        }

    });

})

module.exports = router;
