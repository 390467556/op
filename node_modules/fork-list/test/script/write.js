var fs = require('fs');
var path = require('path');
var forkList = require('../../');

forkList.proc(function(data_file) {
	var d = 'work_' + this.workid + ' += 1;\n';
	fs.appendFileSync(data_file, d);
});