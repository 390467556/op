/*
* 云速打码 http 接口(上传)，node.js 示例代码
* 注意：需要安装restler : npm install restler
*/

var rest 	 = require('restler'),
	fs   	 = require('fs'),
	filename = 'checkCode.jpg';

exports.identifyCode = function(){
	rest.post('http://api.ysdm.net/create.json', {
	multipart: true,
	data: {
		'username': 'xxx',
		'password': 'yyy',
		'typeid':'2040',
		'softid': '58316',
		'softkey': '857679ab35f94d4aa472e5be50a171bb',
		'image': rest.file(filename, null, fs.statSync(filename).size, null, 'image/jpg') // filename: 抓取回来的码证码文件
	},
	headers: {
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
		'Content-Type' : 'application/x-www-form-urlencoded'
	}
}).on('complete', function(data) {
	var captcha = JSON.parse(data);
	console.log('Captcha Encoded.');
	console.log(captcha);
	var code = captcha.Result;
	fs.writeFile('checkCodeText.txt',code);
});
}
