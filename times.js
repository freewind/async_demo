var async = require('async');
var t = require('./t');
var log = t.log;

/**
* 异步运行,times可以指定调用几次，并把结果合并到数组中返回
*/
// times(n, callback)

function delay(n){return (n+12) % 7 *100;}
var createUser = function(id, callback) {
    callback(null, {
        id: 'user' + id,
        delay:delay(id)
    })
}

/**
 * 异步执行，调用3次createUser函数，结果被合并到数组返回
 */
//1.1
async.times(3, function(n, callback){
    log("1.1 enter: "+ n);
    setTimeout(function(){
        log('1.1 handler: ',n);
        createUser(n, function(err, user) {
            callback(err, user)
        })
    },delay(n));
}, function(err, users) {
    log('1.1 err: ',err);
    log('1.1 result: ',users);
});
//07.397> 1.1 enter: 0
//07.400> 1.1 enter: 1
//07.401> 1.1 enter: 2
//07.412> 1.1 handler: 2
//07.912> 1.1 handler: 0
//08.009> 1.1 handler: 1
//08.010> 1.1 err: null
//08.011> 1.1 result: [ { id: 'user0', delay: 500 },
//    { id: 'user1', delay: 600 },
//    { id: 'user2', delay: 0 } ]

/**
*  timesSeries与time唯一不同的是，同步执行
*/
//timesSeries(n, callback)

/**
 * 同步执行，调用3次createUser函数，结果被合并到数组返回
 */
//1.2
async.timesSeries(3, function(n, callback){
    log("1.2 enter: "+ n);
    setTimeout(function(){
        log('1.2 handler: ',n);
        createUser(n, function(err, user) {
            callback(err, user)
        })
    },delay(n));
}, function(err, users) {
    log('1.2 err: ',err);
    log('1.2 result: ',users);
});
//16.642> 1.2 enter: 0
//17.159> 1.2 handler: 0
//17.162> 1.2 enter: 1
//17.763> 1.2 handler: 1
//17.767> 1.2 enter: 2
//17.778> 1.2 handler: 2
//17.779> 1.2 err: null
//17.780> 1.2 result: [ { id: 'user0', delay: 500 },
//    { id: 'user1', delay: 600 },
//    { id: 'user2', delay: 0 } ]