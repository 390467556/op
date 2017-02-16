var x = require('casper').selectXPath;
var casper = require('casper').create({
	verbose:true,
	logLevel:'debug'
});
var fs = require('fs');
var system = require("system");
casper.options.waitTimeout = 30000;
var distribute = require('distribute.js');

casper.start('http://open.oppomobile.com/newuser/login', function() {
    this.echo('填充用户名和密码');
    this.captureSelector('checkCode.jpg','#yw0',{
        quality:100
    });
});


casper.waitFor(function check() {
    return fs.exists('checkCodeText.txt');
}, function then() {
  if (fs.exists('checkCodeText.txt')) {
    var checkCode = fs.read('checkCodeText.txt').trim();
    console.log("checkCode: ");
    console.log(checkCode);
    this.fill('form[class="form-horizontal login"]', {
      'email': 'xxx',
      'passwd': 'yyy!',
      'captcha': checkCode
    }, false);
  }
});

casper.then(function() {
  this.click('button[class="btn btn-primary col-md-12 col-sm-12 col-xs-12"]');
  this.echo('提交...');
});


casper.then(function() {
  this.wait(2000,function() {
  this.capture("login.jpg");
  });
});


casper.then(function(){
  this.wait(1000,function() {
    fs.touch("result.txt");
    if(this.exists('#yw0')){
         fs.write('result.txt','fail');
         this.bypass(2);
     }else{
        fs.write('result.txt','success');
        var cookieStr = JSON.stringify(phantom.cookies);
        var cookieObj = JSON.parse(cookieStr);
        var cookie;
        for(i = 0; i<cookieObj.length; i++){
         if (cookieObj[i].name == "OPPOSID") {
            cookie = cookieObj[i].value;
         }
       }
        console.log('cookie=' + cookie);
        distribute.updateDistribute(cookie);
     }
  });
});


casper.run();
