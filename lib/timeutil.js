/**
 * [currentTime 根据date返回对应的时间戳]
 * @param  {[type]} now [date对象]
 * @return {[type]}     [description]
 */
exports.formatTime = function(now) {

    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日

    var hh = now.getHours(); //时

    var mm = now.getMinutes(); //分

    var ss = now.getSeconds(); //秒

    year = year.toString().substr(1, 2);
    var clock = year;


    if (month < 10)
        clock += "0";

    clock += month;

    if (day < 10)
        clock += "0";

    clock += day;

    if (hh < 10)
        clock += "0";

    clock += hh;

    if (mm < 10)
        clock += "0";

    clock += mm;

    if (ss < 10)
        clock += "0";

    clock += ss;

    return (clock);
};
