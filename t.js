// 其实这个文件名的't'我不是很明白原作者freewind的意思，我觉得叫做'lib.js'或者
// 'helper.js'比较合适，因为这里面都是些辅助函数。

var moment = require('moment');

exports.inc = function(n, callback, timeout) {
  //将参数n自增1之后的结果返回给async
    timeout = timeout || 200;
    setTimeout(function() {
        callback(null, n+1);
    }, timeout);
};

exports.fire = function(obj, callback, timeout) {
  //直接将obj的内容返回给async
    timeout = timeout || 200;
    setTimeout(function() {
        callback(null, obj);
    }, timeout);
};

exports.err = function(errMsg, callback, timeout) {
  //模拟一个错误的产生，让async各个函数末尾的callback接收到。
    timeout = timeout || 200;
    setTimeout(function() {
        callback(errMsg);
    }, timeout);
};

// utils
exports.log = function(msg, obj) {
  //对console.log进行了封装。主要是增加了秒钟的输出，通过秒数的差值方便大家对async的理解。
    process.stdout.write(moment().format('ss.SSS')+'> ');
    if(obj!==undefined) {
        process.stdout.write(msg);
        console.log(obj);
    } else {
        console.log(msg);
    }
};

exports.wait = function(mils) {
  //刻意等待mils的时间，mils的单位是毫秒。
    var now = new Date;
    while(new Date - now <= mils);
}
