var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/login').get(function(req, res) {
		res.render('login');
}).post(function(req, res) {

});

router.route('/register').get(function(req, res) {
		res.render('register');
}).post(function(req, res) {
     console.log(req.body);
     res.send('test');
});




module.exports = router;
