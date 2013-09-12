var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 将多个异步操作的结果合并为一个数组。
 */
// concat(arr, iterator(item,callback(err,result)), callback(err,result))

var data = {
    aaa: [11,22,33],
    bbb: [44,55],
    ccc: 66
};

var keys = [
    {name: 'aaa', delay: 300},
    {name: 'bbb', delay: 100},
    {name: 'ccc', delay: 200}
];

/**
 * 以并行方式对集合中各元素进行异步操作，然后把得到的结果合并为一个数组，传给最后的callback。
 */
// 1.1
async.concat(keys, function(key,callback) {
    setTimeout(function() {
        callback(null, data[key.name]);
    }, key.delay);
}, function(err, values) {
    log('1.1 err: ', err);
    log('1.1 values: ', values);    
});
// 13.539> 1.1 err:
// 13.539> 1.1 values: [ 44, 55, 66, 11, 22, 33 ]

/**
 * 如果中途出错，则把错误以及已经完成的操作的结果交给最后callback。未执行完的则忽略。
 */
// 1.2
async.concat(keys, function(key,callback) {
    setTimeout(function() {
        if(key.name==='ccc') callback('myerr');
        else callback(null, data[key.name]);
    }, key.delay);
}, function(err, values) {
    log('1.2 err: ', err);
    log('1.2 values: ', values);    
});
// 13.439> 1.2 err: myerr
// 13.439> 1.2 values: [ 44, 55 ]

/**
 * 按数组中的元素顺序来执行异步操作，一个完成后才对下一个进行操作。所有结果会汇集成一个数组交给最后的callback。
 */
// concatSeries(arr, iterator, callback)

// 1.3
async.concatSeries(keys, function(key,callback) {
    setTimeout(function() {
        callback(null, data[key.name]);
    }, key.delay);
}, function(err, values) {
    log('1.3 err: ', err);
    log('1.3 values: ', values);    
});
// 13.859> 1.3 err:
// 13.859> 1.3 values: [ 11, 22, 33, 44, 55, 66 ]