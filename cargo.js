var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * cargo也是一个串行的消息队列，类似于queue，通过限制了worker数量，不再一次性全部执行。
 * 当worker数量不够用时，新加入的任务将会排队等候，直到有新的worker可用。
 *
 * cargo的不同之处在于，cargo每次会加载满额的任务做为任务单元，只有任务单元中全部执行完成后，才会加载新的任务单元。
 */
// cargo(worker, [payload])

/**
 * 创建cargo实例
 */
var cargo = async.cargo(function (tasks, callback) {
    for(var i=0; i<tasks.length; i++){
        log('start ' + tasks[i].name);
    }
    callback();
}, 2);


/**
 * 监听：如果某次push操作后，任务数将达到或超过worker数量时，将调用该函数
 */
cargo.saturated = function() {
    log('all workers to be used');
}

/**
 * 监听：当最后一个任务交给worker时，将调用该函数
 */
cargo.empty = function() {
    log('no more tasks wating');
}

/**
 * 监听：当所有任务都执行完以后，将调用该函数
 */
cargo.drain = function() {
    log('all tasks have been processed');
}

/**
 * 增加新任务
 */
cargo.push({name: 'A'}, function (err) {
    t.wait(300);
    log('finished processing A');
});
cargo.push({name: 'B'}, function (err) {
    t.wait(600);
    log('finished processing B');
});
cargo.push({name: 'C'}, function (err) {
    t.wait(500);
    log('finished processing C');
});
cargo.push({name: 'D'}, function (err) {
    t.wait(100);
    log('finished processing D');
});
cargo.push({name: 'E'}, function (err) {
    t.wait(200);
    log('finished processing E');
});
//40.016> all workers to be used
//40.020> no more tasks wating
//40.020> start A
//40.020> start B
//40.322> finished processing A
//40.923> finished processing B
//40.923> no more tasks wating
//40.924> start C
//40.924> start D
//41.425> finished processing C
//41.526> finished processing D
//41.526> no more tasks wating
//41.527> start E
//41.728> finished processing E
//41.728> all tasks have been processed
//41.729> all tasks have been processed
//41.729> all tasks have been processed
//41.729> all tasks have been processed
//41.730> all tasks have been processed