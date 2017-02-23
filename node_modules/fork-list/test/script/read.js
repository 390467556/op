var forkList = require('../../');

forkList.proc(function(data1, data2) {
    console.log('This is work:', this.workid, 'recv data1:', data1, 'recv data2:', data2);
});