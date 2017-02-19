var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');
var tesseract = require('node-tesseract');
var gm = require('gm');
var config = require('./config');
var captcha = require('./lib/captcha');
var fileConfig = require('./lib/fileConfig');

console.log(config.filesForCommunication);

//进入lib目录
process.chdir('lib');

var count = 0;
var arg;

function isLogin() {
    return fs.existsSync('result.txt') && fs.readFileSync('result.txt').toString() === "success";
}

exports.login = function(arg1, arg2) {
    deleteAll();
    //执行登录
    // fs.touch
    arg = arg2;
    var dir = './' + arg;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, 0777);
    }

    var ls = spawn('casperjs', ['login.js', arg2]);
    ls.on('close', function(code) {
        if (code == 1) {
            console.log('child process结束。目标：' + arg2 === 1 ? "预设置脚本" : "爬虫脚本");
            this.bypass(2);
        }
    });

    ls.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });

    ls.on('exit', function(code) {
        console.log('child process exited with code ' + code);
        this.bypass(2);
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

function identifyCode() {
    //等待获取到验证码图片
    while (!fs.existsSync("./" + arg + "/checkCode.jpg")) {

    }
    captcha.identifyCode(arg);
}

function deleteAll() {
    //删除残留通信文件
    for (var i = 0; i < config.filesForCommunication.length; i++) {
        if (fs.existsSync(config.filesForCommunication[i])) {
            fs.unlinkSync(config.filesForCommunication[i]);
        }
    }
}
