var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * async.apply是一个非常好用的函数，可以让我们给一个函数预绑定多个参数并生成一个可直接调用的新函数，简化代码。
 *
 * function(callback) { t.inc(3, callback); }
 * 等价于：
 * async.apply(t.inc, 3);
 */
async.parallel([
    async.apply(t.inc, 3),
    async.apply(t.fire, 100)
], function (err, results) {
    log('err: ', err);
    log('results: ', results);    
});

// 预设参数
var x = async.apply(t.inc, 1);
x(function(err, n){
    console.log('1.inc: ' + n);
});
