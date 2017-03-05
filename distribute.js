// var search = require('./search');
// var x = require('casper').selectXPath;
// var casper = require('casper').create({
//     verbose: true,
//     logLevel: 'debug',
//     stepTimeout: 30000,
//     viewportSize: {
//         width: 1440,
//         height: 900
//     },
//     onWaitTimeout: function() {
//         console.log('-----output-----timeout-----output end-----', 'Info');
//     }
// });

// update("b0a98b2f8ca941bf8e245a834a4603fd",6.0,"来疯直播");
// exports.updateDistribute = function(cookie, price) {
//     // function a(cookie) {
//     //修改应用分发数据
//     update(cookie, price);
//
//     //修复搜索推广价格
//     // if (fs.exists(searchPath)) {
//     // 	 casper.then(function(){
//     // 		 search.updateSearch(cookie);
//     // 	 });
//     // }
// };
/**
 * [更新应用分发里的单价或日限额]
 * @param  {[type]} cookie [description]
 * @return {[type]}        [description]
 */
exports.update = function(cookie, price, from_app_name) {
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
        var ids = this.getElementsAttribute('tr[class="tolist"]', 'id');
        // console.log(ids.length);
        var price_x_path_string;
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var app_name_x_path_string = "//tr[@id='" + id + "']/td[2]";
            var app_name = casper.fetchText(x(app_name_x_path_string));
            // console.log(app_name);
            if (app_name === from_app_name) {
                 price_x_path_string = "//tr[@id='" + id + "']/td[8]/div/a[1]";
            }
        }
        // console.log(price_x_path_string);
        this.mouseEvent("click", x(price_x_path_string));

        // this.mouseEvent("click", x('//a[@class="editbt edit_dayprice"]'));
        this.wait(3000, function() {
            this.mouseEvent("click", x(price_x_path_string));
            this.sendKeys('input#edit_dayprice_input', String(price), {
                reset: true
            });
        });
        this.wait(1000, function() {
            this.click("#qd_price1");
        });
        this.wait(1000, function() {
            console.log('修改单价成功!');
        });

    });
};

String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};


// casper.run();
