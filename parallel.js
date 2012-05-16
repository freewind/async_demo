var async = require('async');

/**
 * 并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。如果某个函数出错，则立刻将err传给parallel最终的callback。
 */
// parallel(tasks, [callback])

var t = require('./t');
var log = t.log;

// 1.1
async.parallel([
    function(cb) { t.fire('a400', cb, 400) },
    function(cb) { t.fire('a200', cb, 200) },
    function(cb) { t.fire('a300', cb, 300) }
], function (err, results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results); 
});

// 1.2
async.parallel([
    function(cb) { log('1.2.1: ', 'start'); t.fire('a400', cb, 400) }, // 该函数的值不会传给最终callback
    function(cb) { log('1.2.2: ', 'start'); t.err('e200', cb, 200) },
    function(cb) { log('1.2.3: ', 'start'); t.fire('a100', cb, 100) }
], function(err, results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});

// 1.3
async.parallel({
    a: function(cb) { t.fire('a400', cb, 400) },
    b: function(cb) { t.fire('c300', cb, 300) }
}, function(err, results) {
    log('1.3 err: ', err);
    log('1.3 results: ', results);
});

// 1.4
async.parallel({
    a: function(cb) { t.fire('a400', cb, 400) }, // 该函数的值不会传给最终的callback
    b: function(cb) { t.err('e300', cb, 300) },
    c: function(cb) { t.fire('c200', cb, 200) }
}, function(err, results) {
    log('1.4 err: ', err);
    log('1.4 results: ', results);
});
