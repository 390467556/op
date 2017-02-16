var x = require('casper').selectXPath;
var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug'
});
var fs = require('fs');
var search = require('search.js');
var timeutil = require('timeutil');
//应用分发更新功能
var username = 'wwmeng@tudou.com';
var today = timeutil.currentTime();
var filePath = './data/' + username + '/17021213';
var distributePath = filePath + '/distribute.txt';
var searchPath = filePath + '/search.txt';


a('ad411609d58541f787e3d71f45c868e1');
// exports.updateDistribute = function(cookie){
function a(cookie) {
    console.log("当前目录：" + distributePath);
    // if (fs.exists(distributePath)) {
    // 	 update(cookie);
    // }
    phantom.addCookie({
        'name': 'OPPOSID',
        'value': cookie,
        'domain': '.oppomobile.com'
    });
    getForm();
    // if (fs.exists(searchPath)) {
    // 	 casper.then(function(){
    // 		 search.updateSearch(cookie);
    // 	 });
    // }
}

function update(cookie) {
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

    casper.start('http://e.oppomobile.com/bid/list', function() {
        this.capture('before.jpg');
        this.mouseEvent("click", x('//a[@class="editbt edit_daybudget"]'));
        this.wait(3000, function() {
            this.mouseEvent("click", x('//a[@class="editbt edit_daybudget"]'));
            this.sendKeys('input#edit_budget_input', dayBudget.toString(), {
                reset: true
            });
        });

        this.wait(1000, function() {
            this.click("#qd_price");
        });

        this.wait(1000, function() {
            console.log('修改日限额成功!');
            this.capture('update_daybudget_success.jpg');
        });

    });

    casper.then(function() {
        this.mouseEvent("click", x('//a[@class="editbt edit_dayprice"]'));
        this.wait(3000, function() {
            this.mouseEvent("click", x('//a[@class="editbt edit_dayprice"]'));
            this.sendKeys('input#edit_dayprice_input', dayPrice.toString(), {
                reset: true
            });
        });
        this.wait(1000, function() {
            this.click("#qd_price1");
        });
        this.wait(1000, function() {
            console.log('修改单价成功!');
            this.capture('update_dayprice_success.jpg');
        });
    });
}

function getForm() {
    casper.start('http://e.oppomobile.com/bid/list', function() {
        // this.echo('getHTML=' + this.getHTML('a[class="campaignLink"]'));
        this.capture('list.jpg');
    });
    casper.then(function() {
        var ids = this.getElementsAttribute('tr[class="tolist"]', 'id');
        for (var i = 0; i < ids.length; i++) {
            printForm(ids[0]);
        }
    });
}

//输出表单数据
function printForm(id) {
    if (id === undefined || id === "") {
        return;
    }
    var ad_name_x_path_string = "//tr[@id='" + id + "']/td/div/a[1]";
    var exposure_num_x_path_string = "//tr[@id='" + id + "']/td[3]";
    var download_num_x_path_string = "//tr[@id='" + id + "']/td[4]";
    var download_rate_x_path_string = "//tr[@id='" + id + "']/td[5]";
    var use_num_x_path_string = "//tr[@id='" + id + "']/td[6]";

    var ad_name = casper.fetchText(x(ad_name_x_path_string));
    var exposure_num = casper.fetchText(x(exposure_num_x_path_string));
    var download_num = casper.fetchText(x(download_num_x_path_string));
    var download_rate = casper.fetchText(x(download_rate_x_path_string));
    var use_num = casper.fetchText(x(use_num_x_path_string));

    console.log('id=' + id);
    console.log('推广名称=' + ad_name.trim());
    console.log('今日曝光量=' + exposure_num.trim());
    console.log('今日下载量=' + download_num.trim());
    console.log('下载率=' + download_rate.trim());
    console.log('今日消耗=' + use_num.trim());
}

String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

casper.run();
