var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * queue是一个串行的消息队列，通过限制了worker数量，不再一次性全部执行。
 * 当worker数量不够用时，新加入的任务将会排队等候，直到有新的worker可用。
 *
 * 该函数有多个点可供回调，如worker用完时、无等候任务时、全部执行完时等。
 */
// queue(worker, concurrency)

/**
 * 定义一个queue，设worker数量为2
 */
var q = async.queue(function(task, callback) {
    log('worker is processing task: ', task.name);
    task.run(callback);
}, 2);

/**
 * 监听：如果某次push操作后，任务数将达到或超过worker数量时，将调用该函数
 */
q.saturated = function() {
    log('all workers to be used');
}

/**
 * 监听：当最后一个任务交给worker时，将调用该函数
 */
q.empty = function() {
    log('no more tasks waiting');
}

/**
 * 监听：当所有任务都执行完以后，将调用该函数
 */
q.drain = function() {
    log('all tasks have been processed');
}

/**
* 独立加入2个任务
*/
q.push({name:'t1', run: function(cb){
    log('t1 is running, waiting tasks: ', q.length());
    t.fire('t1', cb, 400); // 400ms后执行
}}, function(err) {
    log('t1 executed');
});
log('pushed t1, waiting tasks: ', q.length());

q.push({name:'t2',run: function(cb){
    log('t2 is running, waiting tasks: ', q.length());
    t.fire('t2', cb, 200); // 200ms后执行
}}, function(err) {
    log('t2 executed');
});
log('pushed t2, waiting tasks: ', q.length());
//54.448> pushed t1, waiting tasks: 1
//54.451> all workers to be used
//54.452> pushed t2, waiting tasks: 2
//54.452> worker is processing task: t1
//54.453> t1 is running, waiting tasks: 1
//54.455> no more tasks wating
//54.455> worker is processing task: t2
//54.455> t2 is running, waiting tasks: 0
//54.656> t2 executed
//54.867> t1 executed
//54.868> all tasks have been processed


// 同时加入多个任务
q.push([
    {
        name:'t3', run: function(cb){
            log('t3 is running, waiting tasks: ', q.length());
            t.fire('t3', cb, 300); // 300ms后执行
        }
    },{
        name:'t4', run: function(cb){
            log('t4 is running, waiting tasks: ', q.length());
            t.fire('t4', cb, 500); // 500ms后执行
        }
    },{
        name:'t5', run: function(cb){
            log('t5 is running, waiting tasks: ', q.length());
            t.fire('t5', cb, 100); // 100ms后执行
        }
    },{
        name:'t6', run: function(cb){
            log('t6 is running, waiting tasks: ', q.length());
            t.fire('t6', cb, 400); // 400ms后执行
        }
    }
], function(err) {
    log('err: ',err);
});
log('pushed t3,t4,t5,t6 into queue, waiting tasks: ', q.length());
//53.755> all workers to be used
//53.758> pushed t3,t4,t5,t6 into queue, waiting tasks: 4
//53.759> worker is processing task: t3
//53.760> t3 is running, waiting tasks: 3
//53.762> worker is processing task: t4
//53.762> t4 is running, waiting tasks: 2
//54.073> err: null
//54.074> worker is processing task: t5
//54.076> t5 is running, waiting tasks: 1
//54.183> err: null
//54.184> no more tasks wating
//54.185> worker is processing task: t6
//54.186> t6 is running, waiting tasks: 0
//54.265> err: null
//54.588> err: null
//54.589> all tasks have been processed

