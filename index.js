var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');
var tesseract = require('node-tesseract');
var gm = require('gm');
var util = require('util');
var config = require('./config');
var captcha = require('./lib/captcha');
var distribute = require('./lib/distribute');
var form = require('./lib/form');
var dbmanager = require('./myapp/db/dbmanager');
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();
var dbmanager = require('./myapp/db/dbmanager');
dbmanager.connect();

console.log(config.filesForCommunication);

//进入lib目录
process.chdir('lib');

var count = 0;

function isLogin() {
    return fs.existsSync('result.txt') && fs.readFileSync('result.txt').toString() === "success";
}

module.exports.login = function(arg1, arg2) {
    deleteAll();
    var price;
    var account_id;
    var account_username;
    var account_password;
    var uid;
    var platform_name;
    var app_name;
    var dateTime;
    if (arg1 === 1) {
        //根据taskid获取对应task信息
        dbmanager.findOneTask({
            "task_id": arg2
        }, function(error, data) {
            console.log("查询task:" + data);
            account_username = data.account_name;
            account_password = data.account_password;
            platform_name = data.platform_name;
            app_name = data.app_name;
            price = data.price;
            dateTime = data.dt;
            requestLogin(arg1, arg2, account_username, account_password, uid, platform_name, app_name, dateTime, price);
        });
    } else if (arg1 === 2) {
        //根据username获取对应账号信息
        dbmanager.findUsers({
            "username": arg2
        }, function(error, data) {
            console.log("users=" + data);
            uid = data[0].uid;
            dbmanager.findOneTask({
                "uid": uid
            }, function(error, data) {
                console.log("查询task:" + data);
                account_username = data.account_name;
                account_password = data.account_password;
                platform_name = data.platform_name;
                app_name = data.app_name;
                price = data.price;
                dateTime = data.dt;
                requestLogin(arg1, arg2, account_username, account_password, uid, platform_name, app_name, dateTime, price);
            });
        });
    }

};

function requestLogin(arg, arg2, account_username, account_password, uid, platform_name, app_name, nowTime, price) {
    var dir = './' + arg2 + nowTime;
    deleteFolderRecursive(dir);
    fs.mkdirSync(dir, 0777);
    var ls = spawn('casperjs', ['login.js', arg, dir, account_username, account_password, price]);
    ls.on('close', function(code) {
        if (code == 1) {
            console.log("arg1=" + arg);
            console.log('child process结束。目标:');
            if (arg === 1) {
                console.log("预设置脚本结束");
                node_modules.emit('fail');
            } else if (arg === 2) {
                console.log("爬虫脚本结束");
            }
        }
    });

    ls.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        if (isContains(data, "exposure_num")) {
            console.log('stdout: ' + "爬虫数据入库....");
            var showData = JSON.parse(data);
            insertShowdata(uid, platform_name, account_username, account_password, app_name, nowTime, showData.price, showData.daybudget, showData.download_num, showData.exposure_num);
        } else if (isContains(data, "登陆失败")) {
            console.log("重新登录....");
            module.exports.emit('fail');
        } else if (isContains(data, "登陆成功")) {
            // var cookie = data.toString().split("/")[1];
            // if (arg === 1) {
            //     var ls = spawn('casperjs', ['distribute.js', arg, dir, account_username, account_password]);
            //     distribute.updateDistribute(cookie, price);
            // } else if (arg === 2) {
            //     form.getDistribute(cookie);
            // }
        } else if (isContains(data, "修改单价成功")) {
            console.log("修改单价成功");
            dbmanager.updateTaskStatus(arg2,true,function(error,data){
                console.log("修改task status 为true");
            });
            process.exit();
        }
    });

    ls.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function(code) {
        console.log('child process exited with code ' + code);
    });
    identifyCode(dir);
}

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
function insertShowdata(uid, platformName, accountName, accountPassword, appName, nowTime, price, daybudget, download_num, exposure_num) {
    console.log("price:" + price);
    console.log("daybudget:" + daybudget);
    console.log("download_num" + download_num);
    console.log("exposure_num" + exposure_num);
    var ctrPara = download_num / exposure_num;
    console.log("ctrPara" + ctrPara);
    dbmanager.insertSpiderdata(uid, platformName, accountName, accountPassword, appName, nowTime, price, daybudget, ctrPara, function(error, data) {
        console.log("插入爬虫数据成功:" + data);
    });
}

function identifyCode(dir) {
    //等待获取到验证码图片
    while (!fs.existsSync(dir + "/checkCode.jpg")) {

    }
    setTimeout(function() {
        captcha.identifyCode(dir);
    }, 200);

}

/**
 * [deleteFolderRecursive 删除目录及目录下的子文件]
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function deleteAll() {
    //删除残留通信文件
    for (var i = 0; i < config.filesForCommunication.length; i++) {
        if (fs.existsSync(config.filesForCommunication[i])) {
            fs.unlinkSync(config.filesForCommunication[i]);
        }
    }
}
