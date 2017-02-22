var express = require('express');
var router = express.Router();
var db = require('../db/dbmanager')


router.get('/', (req, res) => {
    res.render('config', {warn: undefined})
})


router.post('/', (req, res) => {

  console.log("config : "+ JSON.stringify(req.body));

  res.render('config',{msg:"提交成功"});

})

module.exports = router;
