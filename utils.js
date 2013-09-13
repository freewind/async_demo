var async = require('async');
var t = require('./t');
var log = t.log;

/**
* 让某一个函数在内存中缓存它的计算结果。对于相同的参数，只计算一次，下次就直接拿到之前算好的结果。
* hasher可以让我们自定义如何根据参数来判断它是否已经在缓存中了。
*/
// memoize(fn, [hasher])
//1.1
var slow_fn = function(x, y, callback) {
    log('1.1 start working for: ' + x+','+y);
    t.wait(500);
    log('1.1 finished: ' + x+','+y);
    callback(null, x+','+y);
};
var fn = async.memoize(slow_fn,function(x,y) {
    return x+y;
});
fn('a','b', function(err, result) {
    log("1.1 first time: "+result);
});
fn('cc','d', function(err, result) {
    log("1.1 first time: "+result);
});
fn('a','b', function(err, result) {
    log("1.1 second time: "+result);
});
//15.416> 1.1 start working for: a,b
//15.920> 1.1 finished: a,b
//15.920> 1.1 first time: a,b
//15.921> 1.1 start working for: cc,d
//16.423> 1.1 finished: cc,d
//16.423> 1.1 first time: cc,d
//16.424> 1.1 second time: a,b


/**
* 让已经被缓存的函数，返回不缓存的函数引用。
*/
// unmemoize(fn)
//1.2
var slow_fn2 = function(x, y, callback) {
    log('1.2 start working for: ' + x+','+y);
    t.wait(500);
    log('1.2 finished: ' + x+','+y);
    callback(null, x+','+y);
};
var fn2 = async.memoize(slow_fn2,function(x,y) {
    return x+y;
});

fn2('a','b', function(err,result) {
    log("1.2 first time: "+result);
});

var unFn2 =async.unmemoize(fn2);
log('1.2 unmemoized');

unFn2('a','b', function(err,result) {
    log("1.2 second time: "+result);
});
//16.424> 1.2 start working for: a,b
//16.926> 1.2 finished: a,b
//16.926> 1.2 first time: a,b
//16.927> 1.2 unmemoized
//16.927> 1.2 start working for: a,b
//17.428> 1.2 finished: a,b
//17.428> 1.2 second time: a,b

/**
* 执行某异步函数，并记录它的返回值。试验函数时很方便，不用写那些固定模式的代码。
* 如果该函数向回调中传入了多个参数，则每行记录一个。
*/
// log(function, arguments)
//1.3
var x = function() {
    this.name = 'bsspirit';
}
var hello = function(name, callback) {
    setTimeout(function() {
        callback(null,
            'first ' + name,
            'second '+ name,
            x,
            {a:'123'}
        );
    }, 200);
};
log("1.3 handler");
async.log(hello, 'time');
//37.620> 1.3 handler
//first time
//second time
//[Function]
//{ a: '123' }

/**
* dir与log都是打印出输，在nodejs环境中没有分别。
* dir的不同之处在于，会调用浏览器的console.dir()函数，显示为DOM视图。
*
* http://stackoverflow.com/questions/10636866/whats-the-difference-between-async-log-and-async-dir
*/
//1.4
log("1.4 handler");
async.dir(hello, 'world');
//37.620> 1.4 handler
//first time
//second time
//[Function]
//{ a: '123' }

/**
* noConflict()仅仅用于浏览器端，在nodejs中没用，这里无法演示。
*
* 它的作用是：如果之前已经在全局域中定义了async变量，当导入本async.js时，会先把之前的async变量保存起来，然后覆盖它。
 * 用完之后，调用noConflict()方法，就会归还该值。同时返回async本身供换名使用。
*/
// noConflict()
/*
    // global on the server, window in the browser
    var root = this,
        previous_async = root.async;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    else {
        root.async = async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };
*/