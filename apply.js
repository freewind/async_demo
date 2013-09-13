var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * apply是一个非常好用的函数，可以让我们给一个函数预绑定多个参数并生成一个可直接调用的新函数，简化代码。
 *
 * function(callback) { t.inc(3, callback); }
 * 等价于：
 * async.apply(t.inc, 3);
 */
// apply(function, arguments..)

/**
 * 通过名字绑定函数t.inc, t.fire，作为新函数给parallel调用
 */
//1.1
async.parallel([
    async.apply(t.inc, 3),
    async.apply(t.fire, 100)
], function (err, results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results);
});
//58.605> 1.1 err: null
//58.613> 1.1 results: [ 4, 100 ]

/**
 * 构造一个加法函数，通过apply简化代码
 */
//1.2
function inc(a,b,callback,timeout){
    var timeout = timeout || 200;
    t.wait(200);
    setTimeout(function() {
        callback(null, a+b);
    }, timeout);
}
var fn = async.apply(inc, 1, 2);
fn(function(err, n){
    log('1.2 inc: ' + n);
});
//58.616> 1.2 inc: 3