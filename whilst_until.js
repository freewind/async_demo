var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * 相当于while，但其中的异步调用将在完成后才会进行下一次循环。
 *
 * 它相当于：
 * try {
 *   whilst(test) {
 *     fn();
 *   }
 *   callback();
 * } catch (err) {
 *   callback(err);
 * }
 *
 * 该函数的功能比较简单，条件变量通常定义在外面，可供每个函数访问。在循环中，异步调用时产生的值实际上被丢弃了，因为最后那个callback只能传入错误信息。
 *
 * 另外，第二个函数fn需要能接受一个函数cb，这个cb最终必须被执行，用于表示出错或正常结束。
 *
 */
// whilst(test, fn, callback)

/**
 * 正常情况，没有出错。第二个函数虽然是异步调用，但被同步执行。所以第三个函数被调用时，已经过了3秒。
 */
// 1.1
var count1 = 0;
async.whilst(
    function() { return count1 < 3 },
    function(cb) {
        log('1.1 count: ', count1);
        count1++;
        setTimeout(cb, 1000);
    },
    function(err) {
        // 3s have passed
        log('1.1 err: ', err); // -> undefined
    }
);

/**
 * 中途出错。出错后立刻调用第三个函数。
 */
// 1.2
var count2 = 0;
async.whilst(
    function() { return count2 < 3 },
    function(cb) {
        log('1.2 count: ', count2);
        if(count2===1) {
            t.err('myerr', cb, 200);
        } else {
            count2++;
            setTimeout(cb, 1000);
        }
    },
    function(err) {
        // 2s have passed
        log('1.2 err: ', err); // -> myerr
    }
);

/**
 * 第二个函数即使产生值，也会被忽略。第三个函数只能得到err。
 */
// 1.3
var count3 = 0;
async.whilst(
    function() { return count3 < 3 },
    function(cb) {
        log('1.3 count: ', count3);
        t.inc(count3++, cb);
    },
    function(err,result){ // result没有用
        log('1.3 err: ', err); // -> undefined
        log('1.3 result: ', result); // -> undefined
    }
);

/**
 * until与whilst正好相反，当test为false时循环，与true时跳出。其它特性一致。
 */
// 1.4
var count4 = 0;
async.until(
    function() { return count4>3 },
    function(cb) {
        log('1.4 count: ', count4);
        count4++;
        setTimeout(cb, 200);
    },
    function(err) {
        // 4s have passed
        log('1.4 err: ',err); // -> undefined
    }
);