var async = require('async');
var t = require('./t');
var log = t.log;

/**
* applyEach，可以实现给一数组中每个函数传相同参数，通过callback返回。
* 如果只传第一个参数，将返回一个函数对象，我可以传参调用。
*/
// applyEach(fns, args..., callback)

/**
 * 异步执行，给数组中的函数，他们有相同的参数。
 */
//1.1
async.applyEach([
    function (name,cb) {
        setTimeout(function () {
            log("1.1 handler: " + name + " A");
            cb(null, name);
        }, 500);
    }, function (name,cb) {
        setTimeout(function () {
            log("1.1 handler: " + name + " B");
            cb(null, name);
        }, 150);
    }
], 'Hello', function (err) {
    log('1.1 err: ', err);
});
//06.739> 1.1 handler: Hello B
//07.079> 1.1 handler: Hello A
//07.080> 1.1 err: null

/**
 *  异步执行，当只设置第一参数后，得到函数对象，再传参调用这个函数。
 */
//1.2
var fn = async.applyEach([
    function (name,cb) {
        setTimeout(function () {
            log("1.2 handler: " + name + " A");
        }, 500);
    }, function (name,cb) {
        setTimeout(function () {
            log("1.2 handler: " + name + " B");
        }, 150);
    }
]);
fn("simgle",function(err){
    log('err: ',err);
});
//29.351> 1.2 handler: simgle B
//29.688> 1.2 handler: simgle A

/**
 *   applyEachSeries与applyEach唯一不同的是，数组的函数同步执行。
 */
//applyEachSeries(arr, args..., callback)
//1.3
async.applyEachSeries([
    function (name,cb) {
        setTimeout(function () {
            log("1.3 handler: " + name + " A");
            cb(null, name);
        }, 500);
    }, function (name,cb) {
        setTimeout(function () {
            log("1.3 handler: " + name + " B");
            cb(null, name);
        }, 150);
    }
], "aaa", function (err) {
    log('1.3 err: ', err);
});
//10.669> 1.3 handler: aaa A
//10.831> 1.3 handler: aaa B
//10.834> 1.3 err: null


