var express = require('express');
var router = express.Router();
var db = require('../db/dbmanager')


router.get('/', (req, res) => {
    res.render('config', {warn: undefined})
})


router.post('/', (req, res) => {

})

module.exports = router;
