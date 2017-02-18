var express = require('express');
var dbmanager = require('./dbmanager.js');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
dbmanager.connect();

app.use('/public',express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

router.get('/home',function(req,res){
    res.send('<h1>Hello Home</h1>');

});

router.get('/cat',function(req,res){
    res.send('<h1>Hello Cat</h1>');

});

router.get('/dog',function(req,res){
    res.send('<h1>Hello Dog</h1>');

});

router.post('/public/oppo/register',function(req,res){

    console.log(req.body);
    dbmanager.insertUser(req.body.username, req.body.password,121311212);
    console.log('register did received');
    res.send('<center><h1>注册完毕</h1></center>');
});

// app.use('/',router);
app.use(router);
var port = process.env.PORT || 8080;
app.listen(port);
console.log('Magic Happens on port' + port);
