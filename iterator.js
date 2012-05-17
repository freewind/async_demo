var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 将一组函数包装成为一个iterator，可通过next()得到以下一个函数为起点的新的iterator。该函数通常由async在内部使用，但如果需要时，也可在我们的代码中使用它。
 */
// async.iterator(tasks)

var iter = async.iterator([
    function() { console.log('111') },
    function() { console.log('222') },
    function() { console.log('333') }
]);

// 直接调用()，会执行当前函数，并返回一个由下个函数为起点的新的iterator
console.log('------- iter() ---------');
console.log(iter());
console.log(iter());

// 调用next()，不会执行当前函数，直接返回由下个函数为起点的新iterator
console.log('-------- iter.next() -------');
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

// 对于同一个iterator，多次调用next()，不会影响自己
console.log('-------- iter.next()() -------');
console.log(iter.next()());
console.log(iter.next()());

// 如果只有一个元素，则next()返回null
console.log('--------- last.next() --------');
console.log(iter.next().next().next());