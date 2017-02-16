var x = require('casper').selectXPath;
var casper = require('casper').create({
	verbose:true,
	logLevel:'debug'
});
var fs = require('fs');
var search = require('search.js');
//应用分发更新功能

var username = 'wwmeng@tudou.com';
var filePath = './data/' + username + '/17021213';
var distributePath = filePath + '/distribute.txt';
var searchPath = filePath + '/search.txt';
a('a3b509250b7742629375ed13b8b11d66');
function a(cookie){
	console.log("当前目录：" + distributePath);
	if (fs.exists(distributePath)) {
		 update(cookie);
	}
}

function update(cookie){
	var request = fs.read(distributePath).toString();
	console.log(request);
	var requestObj = JSON.parse(request);
	var dayBudget = requestObj.dayBudget;
	var dayPrice = requestObj.price;
	console.log('dayBudget:' + dayBudget);
	console.log('dayPrice:' + dayPrice);

	phantom.addCookie({
		'name': 'OPPOSID',
		'value': cookie,
		'domain': '.oppomobile.com'
	});

	casper.start('http://e.oppomobile.com/bid/list',function() {
		this.capture('before.jpg');
	// this.mouseEvent("click",x('//a[@class="editbt edit_daybudget"]'));
	// this.wait(3000,function(){
	// 		this.mouseEvent("click",x('//a[@class="editbt edit_daybudget"]'));
	// 		this.sendKeys('input#edit_budget_input', dayBudget.toString() ,{reset:true});
	// 		 });
  //
	// this.wait(1000,function(){
	// 		this.click("#qd_price");
	// });
  //
	// this.wait(1000,function(){
	// 	console.log('修改日限额成功!');
	// 	this.capture('update_daybudget_success.jpg');
	// });

	});

	casper.thenOpen('http://e.oppomobile.com/feeds/list',function(){

    this.click('a[class="btn_create"]');
    this.wait(1000,function(){
      this.capture('after.jpg');
    });
		// this.mouseEvent("click",x('//a[@class="editbt edit_dayprice"]'));
		// this.wait(3000,function(){
		// 		this.mouseEvent("click",x('//a[@class="editbt edit_dayprice"]'));
		// 		this.sendKeys('input#edit_dayprice_input', dayPrice.toString() ,{reset:true});
		// });
		// this.wait(1000,function(){
		// 		this.click("#qd_price1");
		// });
		// this.wait(1000,function(){
		// 	console.log('修改单价成功!');
		// 	this.capture('update_dayprice_success.jpg');
		// });
	});
}

casper.run();
