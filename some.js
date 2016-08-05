var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 当集合中是否有至少一个元素满足条件时，最终callback得到的值为true，否则为false.
 */
// some(arr, iterator(item,callback(test)), callback(result))
//alias: any

var arr = [1,2,3,6];

/**
 * 并行执行，集合中至少有一个元素<=3，所以结果为true
 */
// 1.1
async.some(arr, function(item,callback){
    log('1.1 enter: ',item);
    setTimeout(function(){
        log('1.1 handle: ',item);
        callback(item<=3);
    },100);
}, function(result) {
    log('1.1 result: ', result);
});
// 36.165> 1.1 enter: 1
// 36.165> 1.1 enter: 2
// 36.165> 1.1 enter: 3
// 36.165> 1.1 enter: 6
// 36.275> 1.1 handle: 1
// 36.275> 1.1 result: true
// 36.275> 1.1 handle: 2
// 36.275> 1.1 handle: 3
// 36.275> 1.1 handle: 6


/**
 * 串行执行，集合中没有一个元素>10，所以结果为false
 */
async.some(arr, function(item,callback){
    log('1.2 enter: ',item);
    setTimeout(function(){
        log('1.2 handle: ',item);
        callback(item>10);
    },100);    
}, function(result) {
    log('1.2 result: ', result);
});
// 36.165> 1.2 enter: 1
// 36.165> 1.2 enter: 2
// 36.165> 1.2 enter: 3
// 36.165> 1.2 enter: 6
// 36.275> 1.2 handle: 1
// 36.275> 1.2 handle: 2
// 36.275> 1.2 handle: 3
// 36.275> 1.2 handle: 6
// 36.275> 1.2 result: false
