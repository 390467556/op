var fs = require('fs');
var Path = require('path');
var underscore = require('underscore');
var ForkList = require('../');

var forks;

describe('ForkList', function() {

    describe('.on', function() {

        it('should trigger onExit event', function(done) {

            var path = './script/basic';
            var num = 1;
            var forks = new ForkList({
                path: path,
                num: num,
                log: true
            });

            for (var i = 0; i < 5; i++) {
                forks.send('hello ~', i);
            }

            /*
             * Emitted after the child process ends
             */
            forks.on('exit', function(pid) {
                done();
            });

            forks.shutdown();
        });

        it('should trigger onError event', function(done) {

            var path = './script/basic';
            var num = 1;
            var forks = new ForkList({
                path: path,
                num: num,
                log: true
            });

            /*
             * Emitted when:
             * The process could not be spawned, or
             * The process could not be killed, or
             * Sending a message to the child process failed for whatever reason.
             */
            forks.on('error', function(err, pid) {
                done();
            });

            forks.kill(0);
            forks.send('some message');

            forks.shutdown();
        });


        it('should trigger onFinish event', function(done) {
            var path = './script/basic';
            var num = 1;
            var forks = new ForkList({
                path: path,
                num: num,
                log: true
            });

            for (var i = 0; i < 5; i++) {
                forks.send('hello ~', i);
            }

            /*
             * Emitted after the all child process ends
             */
            forks.on('finish', function() {
                done();
            });

            forks.shutdown();
        });
    });
});