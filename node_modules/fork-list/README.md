# Fork List [![NPM Version](https://badge.fury.io/js/fork-list.svg)](http://badge.fury.io/js/fork-list)

It's easy to fork a list of child process for node.js by ForkList.

## Install

`npm install fork-list`

## Quick Examples

```javascript
var ForkList = require('fork-list');

// which script to run by multiprocess
var path = './script/write';

// child process num
var num = 3;

var forks = new ForkList({
    path: path,
    num: num
});

for (var i = 0; i < 10; i++) {
    forks.send('hello~', i);
}

forks.shutdown();
```

the `./script/write.js` is:

```javascript
var Forks = require('fork-list');

Forks.proc(function(data1, data2) {
    console.log('Work id:', this.workid, 'recv data1:', data1, 'data2:', data2);
});
```

Output:

    Work id: 1 recv data1: hello~ data2: 1
    Work id: 2 recv data1: hello~ data2: 0
    Work id: 0 recv data1: hello~ data2: 5
    Work id: 1 recv data1: hello~ data2: 2
    Work id: 2 recv data1: hello~ data2: 3
    Work id: 1 recv data1: hello~ data2: 9
    Work id: 2 recv data1: hello~ data2: 4
    Work id: 0 recv data1: hello~ data2: 6
    Work id: 2 recv data1: hello~ data2: 7
    Work id: 2 recv data1: hello~ data2: 8

## Documentation

### Initialization
* [`new`](#new)
* [`count`](#count)
* [`setClassifier`](#setClassifier)
* [`setLogger`](#setLogger)

### Transfer
* [`send`](#send)
* [`forward`](#forward)
* [`proc`](#proc)

### Control
* [`kill`](#kill)
* [`killByPid`](#killByPid)
* [`shutdown`](#shutdown)

### Event
* [`onExit`](#onExit)
* [`onError`](#onError)
* [`onFinish`](#onFinish)

<a name="Initialization" />
## Initialization

<a name="new" />
### new(path)

fork a new process with specify path.

<a name="count" />
### count()

get total number of processes.

<a name="setClassifier" />
### setClassifier(classifier)

set special classifier.

<a name="setLogger" />
### setLogger(logger)

enable or disable fork-list debug log, or set your special logger such as log4js.getLogger.

### Example

```javascript
var ForkList = require('fork-list');
var underscore = require('underscore');

var times = 10;
var forks = new ForkList();

forks.new('./script');
forks.new('./script');

forks.setClassifier(function(msg, done) {
    var id = underscore.random(0, forks.count() - 1);
    done(null, id);
});

for (var i = 0; i < times; i++) {
    forks.send(i, 'some msg');
}

forks.shutdown();
```


<a name="Transfor" />
## Transfor

<a name="send" />
### send(msg, ..., cb)
Master: transfor usual data.

```javascript
var forkList = require('fork-list');

// which script to run by multiprocess
var path = './test';

// child process num
var num = 2;

var forks = new ForkList({
    path: path,
    num: num
});

// send data to child process
forks.send(somedata, ...);
```
The usual data include:

* Number
* String
* Array
* JSON
* Object*

*Caution* The Object data wouldn't complete delivery:

```javascript
var forks = new ForkList({
    path: path
});

function test(name) {
    this.name = name || 'default';
}

test.prototype.hi = function() {
    console.log('my name is ', this.name);
};

for (var i = 0; i < times; i++) {
    var t = new test('Alan' + i);
    forks.send(i, t);
}
```
you can only get the basic data `{ name: 'AlanX' }`, and the prototype will lost, you can't call `.hi` in the child process.


<a name="forward" />
### forward(type, handleObject, ..., cb)
Master: transfor `Handle object`, include server object and socket object.

#### Socket forward exmaple

`server.js`
```javascript
var net = require('net');
var config = require('./my_config');
var ForkList = require("fork-list");

var num = 2;
var path = './worker';

var wokers = new ForkList({
    path: path,
    num: num
});

var server = net.createServer();

server.on('connection', function(sock) {

    wokers.foward('socket', sock);

    sock.on('error', function(e) {
        console.log('[server] Error:', e);
    });
});

server.listen(config.port);

console.log('test socket server start');
```
`worker.js`
```javascript
var ForkList = require('fork-list');

ForkList.proc(function(sock) {
    var workid = this.workid;
    sock.on('data', function(data) {
        console.log('[worker] id:', workid, 'data:', data.toString());
    })
});
```
test `client.js`
```javascript
var config = require('./my_config');
var net = require('net');

var client = net.connect({
    hostname: config.host,
    port: config.port
});

client.on('connect', function() {
    var str = 'hello ';
    for (var i = 0; i < 100; i++) {
        client.write(str + i + ' ');
    }
    client.end();
});

client.on('end', function() {
    console.log('client send over!');
});
````

<a name="proc" />
### proc(cb)
Subprocess: get data from master.

```javascript
var forkList = require('fork-list');

forkList.proc(function(msg, ...) {
    /* code */
});
```

<a name="Control" />
## Control

<a name="kill" />
### kill(workid)

This will forcely kill special child process, and don't care if there are some jobs haven't done.

<a name="killByPid" />
### killByPid(pid)

This will forcely kill special child process, and don't care if there are some jobs haven't done.

<a name="shutdown" />
### shutdown()

This will forcely shutdown all child process, and don't care if there are some jobs haven't done. and once all of child process has exited, the `finish` event will emit.

<a name="Event" />
## Event

<a name="onExit" />
### onExit
<a name="onError" />
### onError
<a name="onFinish" />
### onFinish

Example:

```javascript
var ForkList = require('fork-list');

var path = './script';
var num = 3;

var forks = new ForkList({
    path: path,
    num: num,
    log: true
});

for (var i = 10; i >= 0; i--) {
    forks.send('hello ' + i);
};

forks.on('error', function(err, pid) {
    console.log('--> Error:', err.message, 'pid:', pid);
});

forks.on('exit', function(pid) {
    console.log('--> Child process exit, pid:', pid);
    forks.killByPid(pid);
});

forks.on('finish', function() {
    console.log('--> All of child process has exited');
});

forks.shutdown();
```

script.js
```javascript
var Forks = require('fork-list');

Forks.proc(function(data1, data2) {
    console.log('Work id:', this.workid, 'recv data1:', data1);
});
```

Output:

    Work id: 0 recv data1: hello 10
    Work id: 0 recv data1: hello 8
    Work id: 0 recv data1: hello 7
    Work id: 2 recv data1: hello 9
    Work id: 0 recv data1: hello 6
    Work id: 1 recv data1: hello 5
    Work id: 0 recv data1: hello 2
    Work id: 0 recv data1: hello 0
    Work id: 1 recv data1: hello 4
    Work id: 1 recv data1: hello 3
    Work id: 1 recv data1: hello 1
    --> Child process exit, pid: 15064
    --> Error: IPC channel is already disconnected pid: 15064
    --> Child process exit, pid: 13072
    --> Error: IPC channel is already disconnected pid: 13072
    --> Child process exit, pid: 4900
    --> Error: IPC channel is already disconnected pid: 4900
    --> All of child process has exited

## Test

you can test this module by:
```shell
cd node_modules/fork-list
npm test
```

## license

MIT