var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');
var tesseract = require('node-tesseract');
var gm = require('gm');
var config = require('./config');
var captcha = require('./lib/captcha');
var dbmanager = require('./myapp/db/dbmanager');
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();
var dbmanager = require('./myapp/db/dbmanager');
dbmanager.connect();

console.log(config.filesForCommunication);

//进入lib目录
process.chdir('lib');

var count = 0;
var dir;

function isLogin() {
    return fs.existsSync('result.txt') && fs.readFileSync('result.txt').toString() === "success";
}

module.exports.login = function(arg1, arg2, arg3) {
    deleteAll();
    //执行登录
    // fs.touch
    dir = './' + arg3;
    // fs.unlinkSync(dir);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0777);
    }
    var price;
    var account_id;
    var account_username;
    var account_password;
    if (arg1 === 1) {
        //根据taskid获取对应task信息
        dbmanager.findTaskWithId(arg2, function(error, data) {
            price = data[0].price;
            account_id = ata[0].account_id;
            dbmanager.findAccountWithId('58aada6c0de24d31c1bd152e', function(error, data) {
                console.log("data=" + data);
                account_username = data[0].account_username;
                account_password = data[0].account_password;
            });
        });
    } else if (arg1 === 2) {
        //根据username获取对应账号信息
        dbmanager.findPlatformAccountsWithUsername(arg2, function(error, data) {
            dbmanager.findAccountWithId(data[0].account_id, function(error, data) {
                account_username = data[0].account_username;
                account_password = data[0].account_password;
            });
        });
    }

    var ls = spawn('casperjs', ['login.js', arg2 , arg3,account_username, account_password]);
    ls.on('close', function(code) {
        if (code == 1) {
            console.log('child process结束。目标：' + arg1 === 1 ? "预设置脚本" : "爬虫脚本");
        }
    });

    ls.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        if (isContains(data, "exposure_num")) {
            console.log('stdout: ' + "该想数据库写入数据了");
            var showData = JSON.parse(data);
            insertShowdata(account_id,showData.price, showData.daybudget, showData.download_num, showData.exposure_num);
        } else if (isContains(data, "登陆失败")) {
            //重新登录
            module.exports.emit('login_fail');
        }
    });

    ls.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function(code) {
        console.log('child process exited with code ' + code);
    });

    // exec('casperjs login.js', function(error, stdout, stderr) {
    //     console.log("ERROR : " + error);
    //     console.log("STDOUT :" + stdout);
    //     console.log("STDERR :" + stderr);
    //     if (isLogin()) {
    //         //尝试成功
    //         console.log("登录成功");
    //     } else if (fs.existsSync("alertedMessage.txt") && fs.readFileSync("alertedMessage.txt").toString() === "密码错误！") {
    //         //密码错误
    //         console.log("输入的密码错误!");
    //         process.exit(1);
    //     } else {
    //         //尝试失败，重新尝试
    //         count = count + 1;
    //         console.log("登录失败");
    //         // if (count  >= 6) {
    //         //     console.log("超时退出...");
    //         //     process.exit(1);
    //         // }
    //         // if(fs.exists('checkCodeText.txt')){
    //         //     fs.unlinkSync('checkCodeText.txt');
    //         // }
    //         // login();
    //     }
    // });

    identifyCode();
};

function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}

/**
 * [爬虫数据插入对应username表下]
 * @param  {[type]} price        [单价]
 * @param  {[type]} daybudget    [日限额]
 * @param  {[type]} download_num [下载量]
 * @param  {[type]} exposure_num [曝光量]
 * @return {[type]}              [description]
 */
function insertShowdata(account_id,price, daybudget, download_num, exposure_num) {
    console.log("price:" + price);
    console.log("daybudget:" + daybudget);
    console.log("download_num" + download_num);
    console.log("exposure_num" + exposure_num);
    var ctrPara = download_num / exposure_num;
    console.log("ctrPara" + ctrPara);
    dbmanager.insertShowdata(account_id, account_id, '58aada6c0de24d31c1bd152f', new Date().getTime(), price, daybudget, ctrPara, function(err, data) {
        console.log(err);
        console.log(data);
    });
}



function identifyCode() {
    //等待获取到验证码图片
    while (!fs.existsSync(dir + "/checkCode.jpg")) {

    }
    captcha.identifyCode(dir);
}

function deleteAll() {
    //删除残留通信文件
    for (var i = 0; i < config.filesForCommunication.length; i++) {
        if (fs.existsSync(config.filesForCommunication[i])) {
            fs.unlinkSync(config.filesForCommunication[i]);
        }
    }
}
