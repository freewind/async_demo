var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * 并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。
 *
 * 如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。其它未执行完的函数的值不会传到最终数据，但要占个位置。
 * 同时支持json形式的tasks，其最终callback的结果也为json形式。
 */
// parallel(tasks, [callback])

/**
 * 并行执行多个函数，每个函数的值将按函数声明的先后顺序汇成一个数组，传给最终callback。
 */
// 1.1
async.parallel([
    function(cb) { t.fire('a400', cb, 400) },
    function(cb) { t.fire('a200', cb, 200) },
    function(cb) { t.fire('a300', cb, 300) }
], function (err, results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results);
});
//36.929> 1.1 err: null
//36.930> 1.1 results: [ 'a400', 'a200', 'a300' ]

/**
* 如果中途有个函数出错，则将该err和已经完成的函数值汇成一个数组，传给最终的callback。还没有执行完的函数的值将被忽略，但要在最终数组中占个位置
*/
// 1.2
async.parallel([
    function(cb) { log('1.2.1: ', 'start'); t.fire('a400', cb, 400) }, // 该函数的值不会传给最终callback，但要占个位置
    function(cb) { log('1.2.2: ', 'start'); t.err('e200', cb, 200) },
    function(cb) { log('1.2.3: ', 'start'); t.fire('a100', cb, 100) }
], function(err, results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});
//36.537> 1.2.1: start
//36.540> 1.2.2: start
//36.541> 1.2.3: start
//36.741> 1.2 err: e200
//36.744> 1.2 results: [ , undefined, 'a100' ]

/**
* 以json形式传入tasks，最终results也为json
*/
// 1.3
async.parallel({
    a: function(cb) { t.fire('a400', cb, 400) },
    b: function(cb) { t.fire('c300', cb, 300) }
}, function(err, results) {
    log('1.3 err: ', err);
    log('1.3 results: ', results);
});
//36.943> 1.3 err: null
//36.944> 1.3 results: { b: 'c300', a: 'a400' }

/**
* 如果中途出错，会将err与已经完成的函数值（汇成一个json）传给最终callback。未执行完成的函数值被忽略，不会出现在最终json中。
*/
// 1.4
async.parallel({
    a: function(cb) { t.fire('a400', cb, 400) }, // 该函数的值不会传给最终的callback
    b: function(cb) { t.err('e300', cb, 300) },
    c: function(cb) { t.fire('c200', cb, 200) }
}, function(err, results) {
    log('1.4 err: ', err);
    log('1.4 results: ', results);
});
//36.853> 1.4 err: e300
//36.854> 1.4 results: { c: 'c200', b: undefined }

/**
 * 并行执行，同时最多2个函数并行，传给最终callback。
 */
//1.5
async.parallelLimit({
    a:function(cb) { log('a start'); t.fire('a400', cb, 200) },
    b:function(cb) { log('b start'); t.fire('b200', cb, 200) },
    c:function(cb) { log('c start'); t.fire('c100', cb, 100) },
    d:function(cb) { log('d start'); t.fire('d600', cb, 600) },
    e:function(cb) { log('e start'); t.fire('e300', cb, 300) }
},2, function(err, results) {
    log('1.5 err: ', err);
    log('1.5 results: ', results);
});
//26.993> a start
//26.996> b start
//27.200> c start
//27.202> d start
//27.313> e start
//27.809> 1.5 err:
//27.810> 1.5 results: { a: 'a400', b: 'b200', c: 'c100', e: 'e300', d: 'd600' }