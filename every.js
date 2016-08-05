var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 如果集合里每一个元素都满足条件，则传给最终回调的result为true，否则为false
 */
// every(arr, iterator(item,callback), callback(result))
//alias: all

var arr = [1,2,3,6];

/**
 * 并行执行，集合中所有的元素都<=10，所以为true
 */
async.every(arr, function(item,callback){
    log('1.1 enter: ',item);
    setTimeout(function(){
        log('1.1 handle: ',item);
        callback(item<=10);
    },100);    
}, function(result) {
    log('1.1 result: ', result);
});
// 32.113> 1.1 enter: 1
// 32.123> 1.1 enter: 2
// 32.123> 1.1 enter: 3
// 32.123> 1.1 enter: 6
// 32.233> 1.1 handle: 1
// 32.233> 1.1 handle: 2
// 32.233> 1.1 handle: 3
// 32.233> 1.1 handle: 6
// 32.233> 1.1 result: true

/**
 * 并行执行，集合中至少有一个元素不大于2，所以为false
 */
async.every(arr, function(item,callback){
    log('1.2 enter: ',item);
    setTimeout(function(){
        log('1.2 handle: ',item);
        callback(item>2);
    },100);    
}, function(result) {
    log('1.2 result: ', result);
});
// 32.123> 1.2 enter: 1
// 32.123> 1.2 enter: 2
// 32.123> 1.2 enter: 3
// 32.123> 1.2 enter: 6
// 32.233> 1.2 handle: 1
// 32.233> 1.2 result: false
// 32.233> 1.2 handle: 2
// 32.233> 1.2 handle: 3
// 32.233> 1.2 handle: 6
