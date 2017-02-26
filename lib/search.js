var x = require('casper').selectXPath;
var casper = require('casper').create({
	verbose:true,
	logLevel:'debug'
});
var fs = require('fs');
var config = require('./config');

// a('a3b509250b7742629375ed13b8b11d66');
exports.updateSearch = function(cookie){

	var dayBudget ;
	var dayPrice ;
	console.log('dayBudget:' + dayBudget);
	console.log('dayPrice:' + dayPrice);

	phantom.addCookie({
		'name': 'OPPOSID',
		'value': cookie,
		'domain': '.oppomobile.com'
	});

	casper.start(config.oppoUrl.distribute,function() {

	});

  casper.thenOpen(config.oppoUrl.search,function(){

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
