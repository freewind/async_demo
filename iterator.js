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
    function() { console.log('I am 111') },
    function() { console.log('I am 222') },
    function() { console.log('I am 333') }
]);

// 直接调用()，会执行当前函数，并返回一个由下个函数为起点的新的iterator
console.log('------- iter() ---------');
var it1 = iter(); // => 'I am 111'
it1(); // => 'I am 222'
it1(); // => 'I am 222'
it1(); // => 'I am 222'

console.log('----');

var it2 = iter(); // => 'I am 111'
var it3 = it2(); // => 'I am 222'
var it4 = it3(); // => 'I am 333'
// it4(); // 这句代码执行会报错
console.log(it4); // => 'null'

// 调用next()，不会执行当前函数，直接返回由下个函数为起点的新iterator
// 对于同一个iterator，多次调用next()，不会影响自己
console.log('-------- iter.next() -------');
var it5 = iter.next();
it5(); // => 'I am 222'
var it6 = iter.next().next();
it6(); // => 'I am 333'
iter(); // => 'I am 111'


