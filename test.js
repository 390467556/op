var timer = require('./presetTimer');
var timer2 = require('./showTimer');
var dbmanager = require('./myapp/db/dbmanager');
// dbmanager.connect();
var nowTime = new Date().getTime();

var taskid = '58aac1a649832930c8cbfb56';
var username = "wangzhe";
// for (var i = 0; i < 1; i++) {
    var date = new Date();
    timer2.schedule(username);
    // timer.schedule(taskid);
// }
