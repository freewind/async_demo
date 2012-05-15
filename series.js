var async = require('async');

/**
 * series(tasks, [callback])
 * 
 * 依次执行一个函数数组中的每个函数，每一个函数执行完成之后才能执行下一个函数。
 *
 * 如果任何一个函数向它的回调函数中传了一个error，则后面的函数都不会被执行，并且将会立刻会将该error以及已经执行了的函数的结果，传给series中最后那个callback。
 *
 * 当所有的函数执行完后（没有出错），则会把每个函数传给其回调函数的结果合并为一个数组，传给series最后的那个callback。
 *
 * 还可以json的形式来提供tasks。每一个属性都会被当作函数来执行，并且结果也会以json形式传给series最后的那个callback。这种方式可读性更高一些。
 */

var t = require('./t');
var log = t.log;

/**
 * 全部函数都正常执行。
 */
// 1.1
async.series([
    function(cb) { t.inc(3, cb); },
    function(cb) { t.inc(8, cb); },
    function(cb) { t.inc(2, cb); }
], function(err, results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results);
});

/**
 * 中间有函数出错。
 */
// 1.2
async.series([
    function(cb) { t.inc(3, cb); },
    function(cb) { t.err('test_err', cb); },
    function(cb) { t.inc(8, cb); }
], function (err, results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});

/**
 * 如果某个函数传的数据是undefined, null, {}, []等，会是什么情况
 */
// 1.3
async.series([
    function(cb) { t.fire(3, cb);},
    function(cb) { t.fire(undefined, cb); },
    function(cb) { t.fire(null, cb); },
    function(cb) { t.fire({}, cb); },
    function(cb) { t.fire([], cb); },
    function(cb) { t.fire('abc', cb) }
], function(err, results) {
    log('1.3 err: ', err);
    log('1.3 results: ', results);
});