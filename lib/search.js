var x = require('casper').selectXPath;
var casper = require('casper').create({
	verbose:true,
	logLevel:'debug'
});
var fs = require('fs');
var timeutil = require('./timeutil');

// a('a3b509250b7742629375ed13b8b11d66');
exports.updateSearch = function(cookie){
	var today = timeutil.currentTime();
	var username = 'wwmeng@tudou.com';
	var filePath = './data/' + username + '/17021213';
	var searchPath = filePath + '/search.txt';
	console.log("当前目录：" + searchPath);

	var request = fs.read(searchPath).toString();
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

	});

  casper.thenOpen('http://e.oppomobile.com/searchBid/list',function(){

    this.mouseEvent("click",x('//a[@class="editbt edit_daybudget"]'));
    this.wait(3000,function(){
        this.mouseEvent("click",x('//a[@class="editbt edit_daybudget"]'));
        this.sendKeys('input#edit_budget_input', dayBudget.toString() ,{reset:true});
    });

    this.wait(1000,function(){
        this.click("#qd_sbid_dayBudget");
    });

    this.wait(1000,function(){
      console.log('搜索推广-修改日限额成功!');
      this.capture('search_update_daybudget_success.jpg');
    });
  });

	casper.then(function(){
		this.mouseEvent("click",x('//a[@class="editbt edit_dayprice"]'));
		this.wait(3000,function(){
		    this.mouseEvent("click",x('//a[@class="editbt edit_dayprice"]'));
				this.sendKeys('input#edit_dayprice_input', dayPrice.toString() ,{reset:true});
		});
		this.wait(1000,function(){
				this.click("#qd_sbid_price1");
		});
		this.wait(1000,function(){
			console.log('搜索推广-修改单价成功!');
			this.capture('search_update_dayprice_success.jpg');
		});
	});
};

// casper.run();
