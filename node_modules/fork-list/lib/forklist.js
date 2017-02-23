var util = require('util');
var events = require('events');
var underscore = require('underscore');
var child_process = require('child_process');

function ForkList(opts) {
  this.init(opts || {});
}

util.inherits(ForkList, events.EventEmitter);

/*
 * Initialization
 */
ForkList.prototype.init = function(opts) {
  var self = this;

  self.jobs = 0;
  self.list = [];
  self.online = 0;
  self.setLogger(opts.log);
  self.setClassifier(opts.classifier);

  if (!opts || !opts.path) {
    return;
  }

  var num = opts.num || 2;
  var path = opts.path;

  for (var i = 0; i < num; i++) {
    self.new(path);
  }
};

/*
 * New child process
 */
ForkList.prototype.new = function(path) {
  var self = this;
  var child = child_process.fork(path);

  child.on('exit', self.exit.bind(self, child.pid));

  // todo add callback by this event
  child.on('message', function() {
    self.log.info('child message:', arguments);
  });

  child.on('error', function(err) {
    self.emit('error', err, child.pid);
  });

  self.list.push(child);
  self.online += 1;
};

/*
 * Send message by pipe (consider todo)
 */
ForkList.prototype.write = function() {
  var self = this;
  var cb = function() {};
  var args = arguments;

  if (typeof args[args.length - 1] == 'function') {
    cb = args[args.length - 1];
  }

  self.classifier(args, function(err, workid) {
    if (err) {
      return cb(err);
    }

    var child = self.list[workid];
    args.__workdId__ = workid;
    args.__type__ = 'normal';
    args.__master_pid__ = process.pid;

    try {
      child.stdin.write(JSON.stringify(args) + '\n');
      // child.stdin.end();
    } catch (e) {
      console.log('e.message:', e.message);
    }
  });
};

/*
 * Send message to child process
 */
ForkList.prototype.send = function() {
  var self = this;
  var args = arguments;
  var cb;

  if (typeof args[args.length - 1] == 'function') {
    cb = args[args.length - 1];
  }

  self.classifier(args, function(err, workid) {
    if (!!err) {
      return invokeCallback(cb, err);
    }

    var child = self.list[workid];

    if (!child.connected) {
      var err = new Error('child process has already disconnected, workid: ' + workid + ' pid: ' + child.pid);
      if (!invokeCallback(cb, err, child.pid)) {
        self.emit('error', err, child.pid);
      }
      return;
    }

    args.__workdId__ = workid;
    args.__type__ = 'normal';
    args.__master_pid__ = process.pid;

    try {
      child.send(args);
    } catch (err) {
      if (!invokeCallback(cb, err, child.pid)) {
        self.emit('error', err, child.pid);
      }
    }
  });
};

/*
 * Foward Handle object (just for socket, server object)
 */
ForkList.prototype.foward = function(type, obj) {
  var self = this;
  var cb = function() {};
  var args = arguments;

  if (typeof args[args.length - 1] == 'function') {
    cb = args[args.length - 1];
  }

  self.classifier(args, function(err, workid) {
    if (!!err) {
      return cb(err);
    }

    var child = self.list[workid];

    if (!child.connected) {
      var err = new Error('child process has already disconnected, workid: ' + workid + ' pid: ' + child.pid);
      if (!invokeCallback(cb, err, child.pid)) {
        self.emit('error', err, child.pid);
      }
      return;
    }

    child.send({
      __workdId__: workid,
      __type__: type,
      __master_pid__: process.pid
    }, obj);
  });
};

/*
 * Set transport classifier
 */
ForkList.prototype.setClassifier = function(classifier) {
  var self = this;
  if (!!classifier && classifier.constructor == Function) {
    self.classifier = classifier;
  } else {
    self.classifier = function(msg, done) {
      var workid = underscore.random(0, self.list.length - 1);
      done(null, workid);
    };
  }
};

/*
 * Set mater logger
 */
ForkList.prototype.setLogger = function(log) {
  if (!!log && log.constructor == Function) {
    this.log = log;
  } else if (log === true) {
    this.log = {
      info: console.log,
      error: console.error
    };
  } else {
    var empty = function() {};
    this.log = {
      info: empty,
      error: empty
    };
  }
};

/*
 * Get the child process number
 */
ForkList.prototype.count = function() {
  return this.list.length;
};

/*
 * Increase the jobs
 */
ForkList.prototype.inc = function() {
  this.jobs++;
};

/*
 * Get the child process number
 */
ForkList.prototype.exit = function(pid) {
  this.online -= 1;
  this.emit('exit', pid);

  if (this.online === 0) {
    this.emit('finish');
  }
};

/*
 * Forcely end up all child process of the process list
 */
ForkList.prototype.shutdown = function() {
  var self = this;
  for (var i = self.list.length - 1; i >= 0; i--) {
    if (self.list[i].connected) {
      self.list[i].disconnect();
    }
  }
};

/*
 * Forcely end up child process by worker id
 */
ForkList.prototype.kill = function(workid) {
  var self = this;
  var child = self.list[workid];
  if (!child) {
    return false;
  }
  if (child.connected) {
    child.disconnect();
  }
  return true;
};

/*
 * Forcely end up child process by pid
 */
ForkList.prototype.killByPid = function(pid) {
  var self = this;
  for (var i = self.list.length - 1; i >= 0; i--) {
    var child = self.list[i];
    if (child.pid == pid) {
      return self.kill(i);
    }
  }
  return false;
};

/* 
 * Proc for child process
 */
ForkList.proc = function(cb) {
  process.on('message', function(msg, data) {
    // todo there's server
    if (msg.__type__ == 'socket') {
      debug('It\'s socket');
      cb.bind({
        workid: msg.__workdId__,
        error: msg.__err__
      })(data);
      return;
    } else {
      debug('It\'s usual');
      cb.apply({
        workid: msg.__workdId__,
        error: msg.__err__,
      }, getArgsArr(msg, done.bind({
        pid: msg.__master_pid__
      })));
    }
  });
};

var done = function(err) {

};

var getArgsArr = function(msg, cb) {
  var arr = [];
  var i = 0;

  while (msg[i] !== undefined) {
    arr.push(msg[i]);
    i++;
  }

  if (!!cb) {
    arr.push(cb);
  }

  return arr;
};

var invokeCallback = function(cb) {
  if (!!cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1));
    return true;
  } else {
    return false;
  }
};

var debug = function() {};

module.exports = ForkList;