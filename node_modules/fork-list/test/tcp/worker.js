var forkList = require('forklist');

console.log('worker started pid' + process.pid);

forkList.proc(function(err, data) {
    console.log('[worker] work ID:', this.workid, 'arguments:', arguments);
});