var express = require('express');
var router = express.Router();


// 获取注册页面
router.get('/', (req, res) => {
    res.render('register')
})

// 校验注册合法,用户名重复
router.post('/', (req, res) => {
    
})

module.exports = router;
