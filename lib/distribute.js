// var x = require('casper').selectXPath;
// var casper = require('casper').create({
//     verbose: true,
//     logLevel: 'debug'
// });
// var fs = require('fs');

var search = require('./search');
var timeutil = require('./timeutil');
var today = timeutil.currentTime();



// a('ad411609d58541f787e3d71f45c868e1');
exports.updateDistribute = function(cookie, price) {
    // function a(cookie) {
    //修改应用分发数据
    update(cookie, price);

    //修复搜索推广价格
    // if (fs.exists(searchPath)) {
    // 	 casper.then(function(){
    // 		 search.updateSearch(cookie);
    // 	 });
    // }
};
/**
 * [更新应用分发里的单价或日限额]
 * @param  {[type]} cookie [description]
 * @return {[type]}        [description]
 */
function update(cookie, price) {
    console.log('cookie:' + cookie);
    console.log('price:' + String(price));

    if (cookie === "" && price === "") {
        return;
    }

    phantom.addCookie({
        'name': 'OPPOSID',
        'value': cookie,
        'domain': '.oppomobile.com'
    });

    casper.start('http://e.oppomobile.com/bid/list', function() {
        // this.mouseEvent("click", x('//a[@class="editbt edit_daybudget"]'));
        // if (dayBudget !== "") {
        //     this.wait(3000, function() {
        // 			  console.log("mouse............");
        //         this.mouseEvent("click", x('//a[@class="editbt edit_daybudget"]'));
        //         this.sendKeys('input#edit_budget_input', dayBudget.toString(), {
        //             reset: true
        //         });
        //     });
        //
        //     this.wait(1000, function() {
        //         this.click("#qd_price");
        //     });
        //
        //     this.wait(1000, function() {
        //         console.log('修改日限额成功!');
        //     });
        //
        // } else {
        //     console.log("修改日限额dayBudget为空");
        // }

    });

    casper.then(function() {
        this.mouseEvent("click", x('//a[@class="editbt edit_dayprice"]'));
        this.wait(3000, function() {
            this.mouseEvent("click", x('//a[@class="editbt edit_dayprice"]'));
            this.sendKeys('input#edit_dayprice_input', String(price), {
                reset: true
            });
        });
        this.wait(1000, function() {
            this.click("#qd_price1");
        });
        this.wait(1000, function() {
            console.log('修改单价成功!');
            this.capture("success.jpg");
        });

    });
}

String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

// casper.run();
