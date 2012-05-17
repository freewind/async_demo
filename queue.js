var async = require('async');
var t = require('./t');
var log = t.log;

/**
 *
 */

// 定义一个queue，设worker数量为2
var q = async.queue(function(task, callback) {
    log('worker is processing task: ', task.name);
    task.run(callback);
}, 2);

// 如果某次push操作后，任务数将达到或超过worker数量时，将调用该函数
q.saturated = function() {
    log('all workers to be used');
}

// 当最后一个任务交给worker时，将调用该函数
q.empty = function() {
    log('no more tasks wating');
}

// 当所有任务都执行完以后，将调用该函数
q.drain = function() {
    console.log('all tasks have been processed');
}

// 放入单个任务
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

// 放入多个任务
q.push([{name:'t3', run: function(cb){
    log('t3 is running, waiting tasks: ', q.length());
    t.fire('t3', cb, 300); // 300ms后执行
}},{name:'t4', run: function(cb){
    log('t4 is running, waiting tasks: ', q.length());
    t.fire('t4', cb, 500); // 500ms后执行
}}], function(err) {
    log('t3/4 executed');
});

log('pushed t3/t4, waiting tasks: ', q.length());

