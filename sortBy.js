var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 对集合内的元素进行排序，依据每个元素进行某异步操作后产生的值，从小到大排序。
 */
// sortBy(array, iterator(item,callback(err,result)), callback(err,results))

var arr = [3,6,1];

/**
 * 通过异步迭代器，对集合进行排序
 */
async.sortBy(arr, function(item, callback) {
    setTimeout(function() {
        callback(null,item);
    }, 200);
}, function(err,results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results);
});
// 26.562> 1.1 err: null
// 26.562> 1.1 results: [ 1, 3, 6 ]

/**
 * 迭代出错，callback返回err，没有results
 */
async.sortBy(arr, function(item, callback) {
    setTimeout(function() {
        if(item===6) callback('myerr');
        else callback(null,item);
    }, 200);
}, function(err,results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});
// 26.572> 1.2 err: myerr
// 26.572> 1.2 results:
