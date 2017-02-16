var execSync  = require('child_process').execSync;
var exec = require('child_process').exec;
var fs = require('fs');
var tesseract = require('node-tesseract');
var gm        = require('gm');
var config = require('./config');
var captcha = require('./lib/captcha');

console.log(config.filesForCommunication);

//进入lib目录
process.chdir('lib');

var count = 0;

function isLogin(){
  return fs.existsSync('result.txt') && fs.readFileSync('result.txt').toString() === "success";
}

function login(){
    deleteAll();
    //执行登录
    exec('casperjs login.js',function(error,stdout,stderr){
     console.log("ERROR : " + error);
     console.log("STDOUT :" + stdout);
     console.log("STDERR :" + stderr);
        if(isLogin()){
            //尝试成功
            console.log("登录成功");
        }else if(fs.existsSync("alertedMessage.txt") && fs.readFileSync("alertedMessage.txt").toString() === "密码错误！"){
            //密码错误
            console.log("输入的密码错误!");
            process.exit(1);
        }else{
            //尝试失败，重新尝试
            count = count+1;
            console.log("登录失败");
            // if (count  >= 6) {
            //     console.log("超时退出...");
            //     process.exit(1);
            // }
            // if(fs.exists('checkCodeText.txt')){
            //     fs.unlinkSync('checkCodeText.txt');
            // }
            // login();
        }
    });

    identifyCode();
}

function identifyCode(){
      //等待获取到验证码图片
    while(!fs.existsSync("checkCode.jpg")){
        
    }
    captcha.identifyCode();
}

function deleteAll(){
   //删除残留通信文件
for(var i = 0 ; i < config.filesForCommunication.length ; i++){
   if(fs.existsSync(config.filesForCommunication[i])){
       fs.unlinkSync(config.filesForCommunication[i]);
   }
}
}


login();
