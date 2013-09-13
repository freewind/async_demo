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
        log('1.1 err: ', err);
    }
);
//10.318> 1.1 count: 0
//11.330> 1.1 count: 1
//12.342> 1.1 count: 2
//13.356> 1.1 err:


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
        log('1.2 err: ', err);
    }
);
//12.805> 1.2 count: 0
//13.824> 1.2 count: 1
//14.026> 1.2 err: myerr

/**
* 第二个函数即使产生值，也会被忽略。第三个函数只能得到err。
*/
// 1.3
var count3 = 0;
async.whilst(
    function() {return count3 < 3 },
    function(cb) {
        log('1.3 count: ', count3);
        t.inc(count3++, cb);
    },
    function(err,result){ // result没有用
        log('1.3 err: ', err);
        log('1.3 result: ', result);
    }
);
//45.311> 1.3 count: 0
//45.514> 1.3 count: 1
//45.718> 1.3 count: 2
//45.920> 1.3 err:
//45.923> 1.3 result:

/**
*  doWhilst交换了fn,test的参数位置，先执行一次循环，再做test判断。 和javascript中do..while语法一致。
*/
// doWhilst(fn, test, callback)
//1.4
var count4 = 0;
async.doWhilst(
    function(cb) {
        log('1.4 count: ', count4);
        t.inc(count4++, cb);
    },
    function() { log("1.4 test"); return count4 < 3 },
    function(err,result){ // result没有用
        log('1.4 err: ', err);
        log('1.4 result: ', result);
    }
);
//33.643> 1.4 count: 0
//33.848> 1.4 test
//33.850> 1.4 count: 1
//34.054> 1.4 test
//34.057> 1.4 count: 2
//34.269> 1.4 test
//34.270> 1.4 err:
//34.270> 1.4 result:

/**
* until与whilst正好相反，当test为false时循环，与true时跳出。其它特性一致。
*/
// 1.5
var count5 = 0;
async.until(
    function() { return count5>3 },
    function(cb) {
        log('1.5 count: ', count5);
        count5++;
        setTimeout(cb, 200);
    },
    function(err) {
        // 4s have passed
        log('1.5 err: ',err);
    }
);
//42.498> 1.5 count: 0
//42.701> 1.5 count: 1
//42.905> 1.5 count: 2
//43.107> 1.5 count: 3
//43.313> 1.5 err:

/**
* doUntil与doWhilst正好相反，当test为false时循环，与true时跳出。其它特性一致。
*/
// doUntil(fn, test, callback)
// 1.6
var count6 = 0;
async.doUntil(
    function(cb) {
        log('1.6 count: ', count6);
        count6++;
        setTimeout(cb, 200);
    },
    function() { log('1.6 test');return count6>3 },
    function(err) {
        // 4s have passed
        log('1.6 err: ',err);
    }
);
//41.831> 1.6 count: 0
//42.035> 1.6 test
//42.037> 1.6 count: 1
//42.241> 1.6 test
//42.244> 1.6 count: 2
//42.456> 1.6 test
//42.457> 1.6 count: 3
//42.660> 1.6 test
//42.661> 1.6 err:

/**
 * forever，无论条件循环执行，如果不出错，callback永远不被执行
 */
//forever(fn, callback)
//1.7
var count7 = 0;
async.forever(
    function(cb) {
        log('1.7 count: ', count7);
        count7++;
        setTimeout(cb, 200);
    },
    function(err) {
        log('1.7 err: ',err);
    }
);
//52.770> 1.7 count: 0
//52.973> 1.7 count: 1
//53.175> 1.7 count: 2
//53.377> 1.7 count: 3
//53.583> 1.7 count: 4
//53.785> 1.7 count: 5
//53.987> 1.7 count: 6
//54.189> 1.7 count: 7
//54.391> 1.7 count: 8
//54.593> 1.7 count: 9
//54.795> 1.7 count: 10
//54.997> 1.7 count: 11
//55.199> 1.7 count: 12