var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * 创建一个包括一组异步函数的函数集合，每个函数会消费上一次函数的返回值。
 * 把f(),g(),h()异步函数，组合成f(g(h()))的形式，通过callback得到返回值。
 */
// compose(fn1, fn2...)

/**
 * 通过compose组合，f(g(h()))的形式，从内层到外层的执行的顺序。
 */
//1.1
function f(n,callback){
    log('1.1.f enter: ',n);
    setTimeout(function () {
        callback(null, n + 1);
    }, 10);
}
function g(n, callback) {
    log('1.1.g enter: ',n);
    setTimeout(function () {
        callback(null, n * 2);
    }, 10);
}
function h(n, callback) {
    log('1.1.h enter: ',n);
    setTimeout(function () {
        callback(null, n - 10);
    }, 10);
}
var fgh = async.compose(f,g,h);
fgh(4,function(err,result){
    log('1.1 err: ', err);
    log('1.1 result: ', result);
});
//05.307> 1.1.h enter: 4
//05.329> 1.1.g enter: -6
//05.341> 1.1.f enter: -12
//05.361> 1.1 err: null
//05.362> 1.1 result: -11