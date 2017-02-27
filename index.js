var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');
var tesseract = require('node-tesseract');
var gm = require('gm');
var util = require('util');
var config = require('./config');
var captcha = require('./captcha');
var distribute = require('./distribute');
var form = require('./form');
var dbmanager = require('./myapp/db/dbmanager');
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();
// dbmanager.connect();

// process.chdir('lib');

/**
 * [login 对外提供入口，爬虫或者预设置，都需要登录]
 * @param  {[type]} arg1 [action 操作：1是预设置出价，2是爬虫数据]
 * @param  {[type]} arg2 [taskid或者username]
 * @return {[type]}      [description]
 */
module.exports.login = function(arg1, arg2) {
    // deleteAll();
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
                dateTime = new Date().getTime();
                requestLogin(arg1, arg2, account_username, account_password, uid, platform_name, app_name, dateTime, price);
            });
        });
    }
};

/**
 * [requestLogin 登录和毁掉处理]
 * @param  {[type]} arg              [action操作 1是预设置出价，2是爬虫]
 * @param  {[type]} arg2             [如果action＝1，arg2是taskid,如果action＝2，arg2是username]
 * @param  {[type]} account_username [平台账号]
 * @param  {[type]} account_password [平台密码]
 * @param  {[type]} uid              [用户表id]
 * @param  {[type]} platform_name    [平台名称]
 * @param  {[type]} app_name         [产品名称]
 * @param  {[type]} nowTime          [执行任务时间]
 * @param  {[type]} price            [description]
 * @return {[type]}                  [description]
 */
function requestLogin(arg1, arg2, account_username, account_password, uid, platform_name, app_name, nowTime, price) {
    var dir = './' + arg2 + nowTime;
    deleteFolderRecursive(dir);
    fs.mkdirSync(dir, 0777);
    var data = {
        'action': arg1,
        'dir': dir,
        'account_username': account_username,
        'account_password': account_password,
        'price': price
    };
    console.log(JSON.stringify(data));
    var jsName;
    if (platform_name === "oppo") {
        jsName = 'loginOppo.js';
    } else if (platform_name === "eoppo") {
        jsName = 'loginEoppo.js';
    }
    console.log('jsName:' + jsName);
    var ls = spawn('casperjs', [jsName, JSON.stringify(data)]);
    ls.on('close', function(code) {
        if (code == 1) {
            console.log("arg1=" + arg1);
            console.log('child process结束。目标:');
            if (arg1 === 1) {
                console.log("预设置脚本结束");
                node_modules.emit('fail');
            } else if (arg1 === 2) {
                console.log("爬虫脚本结束");
            }
        }
    });

    ls.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        if (isContains(data, "exposure_num")) {
            console.log('stdout: ' + "爬虫数据入库....");
            var showData = JSON.parse(data);
            insertShowdata(uid, platform_name, account_username, account_password, app_name, nowTime, showData.price, showData.use_num, showData.download_num, showData.download_rate, showData.exposure_num, showData.daybudget);
        } else if (isContains(data, "登陆失败")) {
            console.log("重新执行任务...." + arg1);
            module.exports.login(arg1, arg2);
        } else if (isContains(data, "修改单价成功")) {
            console.log("修改单价成功");
            dbmanager.updateTaskStatus(arg2, true, function(error, data) {
                console.log("修改task status 为true");
            });
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
 * [insertShowdata 爬虫数据插入对应username表下]
 * @param  {[type]} uid             [用户表id]
 * @param  {[type]} platformName    [平台名称]
 * @param  {[type]} accountName     [平台账号]
 * @param  {[type]} accountPassword [平台密码]
 * @param  {[type]} appName         [产品名称]
 * @param  {[type]} nowTime         [任务执行时间戳]
 * @param  {[type]} price           [单价]
 * @param  {[type]} use_num       [今日消耗]
 * @param  {[type]} download_num    [下载量]
 * @param  {[type]} exposure_num    [曝光量]
 * @return {[type]}                 [description]
 */
function insertShowdata(uid, platformName, accountName, accountPassword, appName, nowTime, price, use_num, download_num, download_rate, exposure_num, daybudget) {
    console.log("price:" + price);
    console.log("use_num:" + use_num);
    console.log("download_num:" + download_num);
    console.log("exposure_num:" + exposure_num);
    console.log("download_rate:" + download_rate);
    dbmanager.findSpiderDatas({
        "account_name": accountName,
        "app_name": appName
    }, function(error, data) {
        console.log("findSpiderDatas-error:" + error);
        console.log("spiderData数据表长度＝" + data.length);
        var last_use_num;
        if (data === undefined || data.length === 0) {
            last_use_num = use_num;
        } else {
            last_use_num = data[data.length - 1].use_num;
            if (last_use_num === undefined) {
                last_use_num = use_num;
            }
        }
        var hourUse = use_num - last_use_num;
        dbmanager.insertSpiderdata(uid, platformName, accountName, accountPassword, appName, nowTime, price, hourUse, download_rate, daybudget, use_num, function(error, data) {
            console.log("insertSpiderdata-error:" + error);
            console.log("插入爬虫数据成功:" + data);
        });
    });
}


/**
 * [identifyCode 验证码]
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
function identifyCode(dir) {
    //等待获取到验证码图片
    while (!fs.existsSync(dir + "/" + config.filePath.checkCodeJpg)) {

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

// function deleteAll() {
//     //删除残留通信文件
//     for (var i = 0; i < config.filesForCommunication.length; i++) {
//         if (fs.existsSync(config.filesForCommunication[i])) {
//             fs.unlinkSync(config.filesForCommunication[i]);
//         }
//     }
// }

// process.on('uncaughtException', function(err) {　　
//     console.log('Caught exception: ' + err);
// });
