var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 对集合中的每一个元素，执行某个异步操作，得到结果。所有的结果将汇总到最终的callback里。与each的区别是，each只关心操作不管最后的值，而map关心的最后产生的值。
 *
 * 提供了两种方式：
 * 1. 并行执行。同时对集合中所有元素进行操作，结果汇总到最终callback里。如果出错，则立刻返回错误以及已经执行完的任务的结果，未执行完的占个空位
 * 2. 顺序执行。对集合中的元素一个一个执行操作，结果汇总到最终callback里。如果出错，则立刻返回错误以及已经执行完的结果，未执行的被忽略。
 */
// map(arr, iterator(item, callback), callback(err, results))

var arr = [{name:'Jack', delay:200}, {name:'Mike', delay: 100}, {name:'Freewind', delay:300}, {name:'Test', delay: 50}];

/**
 * 所有操作均正确执行，未出错。所有结果按元素顺序汇总给最终的callback。
 */
// 1.1
async.map(arr, function(item, callback) {
    log('1.1 enter: ' + item.name);
    setTimeout(function() {
        log('1.1 handle: ' + item.name);
        callback(null, item.name + '!!!');
    }, item.delay);
}, function(err,results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results);
});
// 54.569> 1.1 enter: Jack
// 54.569> 1.1 enter: Mike
// 54.569> 1.1 enter: Freewind
// 54.569> 1.1 enter: Test
// 54.629> 1.1 handle: Test
// 54.679> 1.1 handle: Mike
// 54.789> 1.1 handle: Jack
// 54.879> 1.1 handle: Freewind
// 54.879> 1.1 err:
// 54.879> 1.1 results: [ 'Jack!!!', 'Mike!!!', 'Freewind!!!', 'Test!!!' ]

/**
*  如果中途出错，立刻将错误、以及已经执行完成的结果汇总给最终callback。未执行完的将会在结果数组中用占个空位。
*/
async.map(arr, function(item, callback) {
    log('1.2 enter: ' + item.name);
    setTimeout(function() {
        log('1.2 handle: ' + item.name);
        if(item.name==='Jack') callback('myerr');
        else callback(null, item.name+'!!!');
    }, item.delay);
}, function(err, results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});
// 54.569> 1.2 enter: Jack
// 54.569> 1.2 enter: Mike
// 54.569> 1.2 enter: Freewind
// 54.569> 1.2 enter: Test
// 54.629> 1.2 handle: Test
// 54.679> 1.2 handle: Mike
// 54.789> 1.2 handle: Jack
// 54.789> 1.2 err: myerr
// 54.789> 1.2 results: [ undefined, 'Mike!!!', , 'Test!!!' ]
// 54.879> 1.2 handle: Freewind

/**
* 顺序执行，一个完了才执行下一个。
*/
async.mapSeries(arr, function(item, callback) {
    log('1.3 enter: ' + item.name);
    setTimeout(function() {
        log('1.3 handle: ' + item.name);
        callback(null, item.name+'!!!');
    }, item.delay);
}, function(err,results) {
    log('1.3 err: ', err);
    log('1.3 results: ', results);
});
// 54.569> 1.3 enter: Jack
// 54.789> 1.3 handle: Jack
// 54.789> 1.3 enter: Mike
// 54.899> 1.3 handle: Mike
// 54.899> 1.3 enter: Freewind
// 55.209> 1.3 handle: Freewind
// 55.209> 1.3 enter: Test
// 55.269> 1.3 handle: Test
// 55.269> 1.3 err:
// 55.269> 1.3 results: [ 'Jack!!!', 'Mike!!!', 'Freewind!!!', 'Test!!!' ]

/**
* 顺序执行过程中出错，只把错误以及执行完的传给最终callback，未执行的忽略。
*/
async.mapSeries(arr, function(item, callback) {
    log('1.4 enter: ' + item.name);
    setTimeout(function() {
        log('1.4 handle: ' + item.name);
        if(item.name==='Mike') callback('myerr');
        else callback(null, item.name+'!!!');
    }, item.delay);
}, function(err, results) {
    log('1.4 err: ', err);
    log('1.4 results: ', results);
});
// 47.616> 1.4 enter: Jack
// 47.821> 1.4 handle: Jack
// 47.821> 1.4 enter: Mike
// 47.931> 1.4 handle: Mike
// 47.931> 1.4 err: myerr
// 47.932> 1.4 results: [ 'Jack!!!', undefined ]

/**
 * 并行执行，同时最多2个函数并行，传给最终callback。
 */
//1.5
async.mapLimit(arr,2, function(item, callback) {
    log('1.5 enter: ' + item.name);
    setTimeout(function() {
        log('1.5 handle: ' + item.name);
        if(item.name==='Jack') callback('myerr');
        else callback(null, item.name+'!!!');
    }, item.delay);
}, function(err, results) {
    log('1.5 err: ', err);
    log('1.5 results: ', results);
});
//57.797> 1.5 enter: Jack
//57.800> 1.5 enter: Mike
//57.900> 1.5 handle: Mike
//57.900> 1.5 enter: Freewind
//58.008> 1.5 handle: Jack
//58.009> 1.5 err: myerr
//58.009> 1.5 results: [ undefined, 'Mike!!!' ]
//58.208> 1.5 handle: Freewind
//58.208> 1.5 enter: Test
//58.273> 1.5 handle: Test
