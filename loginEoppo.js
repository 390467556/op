/**
 * [oppo代理执行脚本]
 */
var x = require('casper').selectXPath;
var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    stepTimeout: 30000,
    onWaitTimeout: function() {
        console.log('-----output-----timeout-----output end-----', 'Info');
    }
});
var fs = require('fs');
var system = require("system");
var distribute = require('./distribute');
var form = require('./form');
var config = require('./config');

casper.options.waitTimeout = 30000;
var args = casper.cli.args;
var data = JSON.parse(args);
var action = data.action;
var dir = data.dir;
var username = data.account_username;
var password = data.account_password;
var price = data.price;
var app_name = data.app_name;

console.log("dir=" + dir);
console.log("action=", action);
console.log("username=" + username);
console.log("password=" + password);
console.log("price=" + price);
console.log("app_name=" + app_name);

var login_url = config.oppoUrl.elogin;


casper.start(login_url, function() {
    console.log('登录.....');
    this.captureSelector(dir + '/' + config.filePath.checkCodeJpg, '#auth_code', {
        quality: 100
    });
});

casper.waitFor(function check() {
    return fs.exists(dir + '/' + config.filePath.checkCodeText);
}, function then() {
    if (fs.exists(dir + '/' + config.filePath.checkCodeText)) {
        this.click('label[class="ownerType_label"]');
        var checkCode = fs.read(dir + '/' + config.filePath.checkCodeText).trim();
        console.log("checkCode: " + checkCode);
        this.fill('form[class="login_form"]', {
            'name': username,
            'passwd': password,
            'captcha': checkCode
        }, false);
    }
});

casper.then(function() {
    this.click('input[class="button login_button"]');
    // this.click('#loginBtn');
    this.echo('提交...');
});


casper.then(function() {
    this.wait(2000, function() {
        // fs.touch(dir + "/result.txt");
        if (this.exists('#auth_code')) {
            // fs.write(dir + '/result.txt', 'fail');
            this.bypass(2);
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
                distribute.update(cookie, price, app_name);
            } else if (action === 2) {
                form.getDistribute(cookie);
            }
        }
    });
});

casper.run();
