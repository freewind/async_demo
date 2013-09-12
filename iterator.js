var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * 将一组函数包装成为一个iterator，初次调用此iterator时，会执行定义中的第一个函数并返回第二个函数以供调用。
 * 也可通过手动调用 next() 得到以下一个函数为起点的新的iterator。
 * 该函数通常由async在内部使用，但如果需要时，也可在我们的代码中使用它。
 */
// async.iterator(tasks)

var iter = async.iterator([
    function () {log('I am 111')},
    function () {log('I am 222')},
    function () {log('I am 333')}
]);

/**
* 直接调用()，会执行当前函数，并返回一个由下个函数为起点的新的iterator
*/
//1.1
log('1.1 iter()');
var it1 = iter();
it1();
it1();
//28.368> 1.1 iter()
//28.371> I am 111
//28.372> I am 222
//28.372> I am 222

/**
* 通过iter()来调用下一个函数
*/
log('1.2 iter()');
var it2 = iter();
var it3 = it2();
var it4 = it3();
//it4(); // 这句代码执行会报错
log(it4); // => 'null'
//32.449> 1.2 iter()
//32.452> I am 111
//32.452> I am 222
//32.453> I am 333
//32.454> null

/**
 * 调用next()，不会执行当前函数，直接返回由下个函数为起点的新iterator
 * 对于同一个iterator，多次调用next()，不会影响自己
 */
//1.3
log('1.3 iter()');
var it5 = iter.next();
it5();
var it6 = iter.next().next();
it6();
iter();
//39.895> 1.3 iter()
//39.898> I am 222
//39.899> I am 333
//39.899> I am 111

