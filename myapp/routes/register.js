var express = require('express');
var router = express.Router();
var db = require('../db/dbmanager')

// 获取注册页面
router.get('/', (req, res) => {
    res.render('register', {warn: undefined})
})

// 校验注册合法,用户名重复
router.post('/', (req, res) => {
    var username = req.body.data.username
    db.findUsers({ "username": username}, (err, users) => {
        if (err) {
            console.log("Failed to findUser, username is ", username)
            res.render('register', {warn: "网络忙，请重试"})
        }
        if (users.length === 0) {
            // userid
            var userid
            db.insertUser(username, req.body.data.password, userid, (err, user) => {
                if (err) {
                    console.log("Failed to insert user, username is ", username)
                    res.render('register', {warn: "网络忙，请重试"})
                }
                res.render('config')
            })
        }

        res.render('register', {warn: "用户重复"})
    })
})

module.exports = router;
