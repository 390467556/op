// var x = require('casper').selectXPath;
// var casper = require('casper').create({
//     verbose: true,
//     logLevel: 'debug'
// });
// var fs = require('fs');
// var timeutil = require('timeutil');


// init('ad411609d58541f787e3d71f45c868e1');

exports.getDistribute = function(cookie) {
    console.log('进入爬虫');
    phantom.addCookie({
        'name': 'OPPOSID',
        'value': cookie,
        'domain': '.oppomobile.com'
    });
    getForm();
};

function getForm() {

    casper.start('http://e.oppomobile.com/bid/list', function() {
        this.capture('list.jpg');
        console.log('打开链接');
    });
    console.log('>>>>>');
    casper.then(function() {
      console.log('获取数据');
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
    //TODO 写入数据库或者文件
}

String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

// casper.run();
