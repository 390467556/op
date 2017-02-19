// var x = require('casper').selectXPath;
// var casper = require('casper').create({
//     verbose: true,
//     logLevel: 'debug'
// });
// var fs = require('fs');
// var timeutil = require('timeutil');


// init('ad411609d58541f787e3d71f45c868e1');
var dbmanager = require('../myapp/db/dbmanager');

exports.getDistribute = function(cookie) {
    console.log('开始爬虫.....');
    phantom.addCookie({
        'name': 'OPPOSID',
        'value': cookie,
        'domain': '.oppomobile.com'
    });
    getForm();
};

function getForm() {

    casper.start('http://e.oppomobile.com/bid/list', function() {
    });
    casper.then(function() {
        var ids = this.getElementsAttribute('tr[class="tolist"]', 'id');
        for (var i = 0; i < ids.length; i++) {
            printForm(ids[0]);
        }
    });
}

/**
 * [根据广告id获取对应的表单数据]
 * @param  {[type]} id [广告id]
 * @return {[type]}    [description]
 */
function printForm(id) {
    if (id === undefined || id === "") {
        return;
    }
    var ad_name_x_path_string = "//tr[@id='" + id + "']/td/div/a[1]";
    var app_name_x_path_string = "//tr[@id='" + id + "']/td/div/a[2]";
    var exposure_num_x_path_string = "//tr[@id='" + id + "']/td[3]";
    var download_num_x_path_string = "//tr[@id='" + id + "']/td[4]";
    var download_rate_x_path_string = "//tr[@id='" + id + "']/td[5]";
    var use_num_x_path_string = "//tr[@id='" + id + "']/td[6]";
    var daybudget_num_x_path_string = "//tr[@id='" + id + "']/td[7]";
    var price_x_path_string = "//tr[@id='" + id + "']/td[8]";
    var status_x_path_string = "//tr[@id='" + id + "']/td[9]";

    var ad_name = casper.fetchText(x(ad_name_x_path_string));
    var app_name = casper.fetchText(x(app_name_x_path_string));
    var exposure_num = casper.fetchText(x(exposure_num_x_path_string));
    var download_num = casper.fetchText(x(download_num_x_path_string));
    var download_rate = casper.fetchText(x(download_rate_x_path_string));
    var use_num = casper.fetchText(x(use_num_x_path_string));
    var daybudget = casper.fetchText(x(daybudget_num_x_path_string));
    var price = casper.fetchText(x(price_x_path_string));
    var status = casper.fetchText(x(status_x_path_string));


    console.log('id=' + id);
    console.log('推广名称=' + ad_name.trim());
    console.log('应用名称=' + app_name.trim());
    console.log('今日曝光量=' + exposure_num.trim());
    console.log('今日下载量=' + download_num.trim());
    console.log('下载率=' + download_rate.trim());
    console.log('今日消耗=' + use_num.trim());
    console.log('日限额=' + daybudget.trim());
    console.log('出价=' + price.trim());
    console.log('状态=' + status.trim());
    //TODO 写入数据库或者文件
    var ctrPara = download_num;
    dbmanager.connect();
    dbmanager.insertShowdata(1,1,1,new Date().getTime(),price.trim(),daybudget.trim(),ctrPara);
}


String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

// casper.run();
