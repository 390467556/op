/**
 * [oppo开发者执行脚本]
 */
var x = require('casper').selectXPath;
var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    stepTimeout: 30000,
    viewportSize:{width:1440,height:900},
    onWaitTimeout: function() {
        console.log('-----output-----timeout-----output end-----', 'Info');
    }
});
var fs = require('fs');
var system = require("system");
var distribute = require('./distribute');
var form = require('./form');
var config = require('./config');
casper.options.viewportSize = {
    width: 1440,
    height: 900
};
casper.options.waitTimeout = 30000;
var args = casper.cli.args;
var data = JSON.parse(args);
var action = data.action;
var dir = data.dir;
var username = data.account_username;
var password = data.account_password;
var price = data.price;

console.log("dir=" + dir);
console.log("action=", action);
console.log("username=" + username);
console.log("password=" + password);
console.log("price=" + price);

var login_url = config.oppoUrl.login;


casper.start(login_url, function() {
    console.log('登录.....');
    this.captureSelector(dir + '/' + config.filePath.checkCodeJpg, '#yw0', {
        quality: 100
    });
});

casper.waitFor(function check() {
    return fs.exists(dir + '/' + config.filePath.checkCodeText);
}, function then() {
    if (fs.exists(dir + '/' + config.filePath.checkCodeText)) {
        var checkCode = fs.read(dir + '/' + config.filePath.checkCodeText).trim();
        console.log("checkCode: " +checkCode);
        this.fill('form[class="form-horizontal login"]', {
            'email': username,
            'passwd': password,
            'captcha': checkCode
        }, false);
    }
});

casper.then(function() {
    this.click('button[class="btn btn-primary col-md-12 col-sm-12 col-xs-12"]');
    this.echo('提交...');
});

/*
casper.then(function(){
  this.wait(2000,function(){
	this.capture(dir + '/login.jpg');
});
});
*/

casper.then(function() {
    this.wait(2000, function() {
        // fs.touch(dir + "/result.txt");
        if (this.exists('#yw0')) {
            // fs.write(dir + '/result.txt', 'fail');
            console.log("登陆失败");
        } else {

            // fs.write(dir + '/result.txt', 'success');
            var cookieStr = JSON.stringify(phantom.cookies);
            var cookieObj = JSON.parse(cookieStr);
            var cookie;
            for (i = 0; i < cookieObj.length; i++) {
                if (cookieObj[i].name == "OPPOSID") {
                    cookie = cookieObj[i].value;
                }
            }
						console.log("登陆成功/" + cookie);
            if (action === 1) {
                distribute.updateDistribute(cookie, price);
            } else if (action === 2) {
                form.getDistribute(cookie);
            }
        }
    });
});


casper.run();
