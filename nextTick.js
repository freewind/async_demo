var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * nextTick的作用与nodejs的nextTick一样，再最后调用函数。
 * 但在浏览器端，只能使用setTimeout(callback,0)，但这个方法有时候会让其它高优先级的任务插到前面去。
 * 所以提供了这个nextTick，让同样的代码在服务器端和浏览器端表现一致。
 */
// nextTick(callback)

var calls = [];
async.nextTick(function() {
    calls.push('two');
});
async.nextTick(function() {
    log('1.1',calls);
});
calls.push('one');
log('1.2',calls);
async.nextTick(function() {
    log('1.3',calls);
});
//09.838> 1.2[ 'one' ]
//09.842> 1.1[ 'one', 'two' ]
//09.843> 1.3[ 'one', 'two' ]
