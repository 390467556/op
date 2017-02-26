var Forks = require('fork-list');

Forks.proc(function(data1, data2) {
    console.log('Work id:', this.workid, 'recv data1:', data1);
});
