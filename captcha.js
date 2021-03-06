/*
 * 云速打码 http 接口(上传)，node.js 示例代码
 * 注意：需要安装restler : npm install restler
 */

var rest = require('restler');
var fs = require('fs');
var config = require('./config');

exports.identifyCode = function(arg) {
    var file_path = arg + '/' + config.filePath.checkCodeJpg;
    console.log("file_path=" + file_path);

    fs.stat(file_path, function(err, stats) {
        if (err) {
            throw err;
        } else {
            console.log("file_path_size=" + stats.size);
            rest.post('http://api.ysdm.net/create.json', {
                multipart: true,
                data: {
                    'username': config.captchaConfig.username,
                    'password': config.captchaConfig.pwd,
                    'typeid': config.captchaConfig.typeid,
                    'softid': config.captchaConfig.softid,
                    'softkey': config.captchaConfig.softkey,
                    'image': rest.file(file_path, null, stats.size, null, 'image/jpg') // file_path: 抓取回来的码证码文件
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
                    'Content-Type': 'applicationf/x-www-form-urlencoded'
                }
            }).on('complete', function(data) {
                if (data instanceof Error) {
                    console.log('Error:', result.message);
                    this.retry(5000); // try again after 5 sec
                } else {
                    var captcha = JSON.parse(data);
                    console.log('Captcha Encoded.');
                    console.log(captcha);
                    var code = captcha.Result;
                    fs.writeFile(arg + '/' + config.filePath.checkCodeText, code);
                }
            });
        }
    });


};
