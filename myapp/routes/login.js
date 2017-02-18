var express = require('express');
var router = express.Router();

// get用于获取登录页面
router.get('/', (req, res) => {
    res.render('login')
})

// post用于登录
router.post('/', (req, res) => {
    
})


module.exports = router;
