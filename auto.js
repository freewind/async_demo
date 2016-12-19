var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * auto用来处理有依赖关系的多个任务的执行。
 *
 * 比如某些任务之间彼此独立，可以并行执行；但某些任务依赖于其它某些任务，只能等那些任务完成后才能执行。
 * 虽然我们可以使用parallel和series结合起来实现该功能，但如果任务之间关系复杂，则代码会相当复杂，以后如果想添加一个新任务，也会很麻烦。
 * 这时使用auto，则会事半功倍。
 *
 * 如果有任务中途出错，则会把该错误传给最终callback，所有任务（包括已经执行完的）产生的数据将被忽略。
 * 如果不关心错误和最终数据，可以不用写最后那个callback。
 */
// async.auto(tasks, [callback])

/**
 * 我要写一个程序，它要完成以下几件事：
 * 1. 从某处取得数据
 * 2. 在硬盘上建立一个新的目录
 * 3. 将数据写入到目录下某文件
 * 4. 发送邮件，将文件以附件形式发送给其它人。
 *
 * 分析该任务，可以知道1与2可以并行执行，3需要等1和2完成，4要等3完成。
 * 可以按以下方式来使用auto函数。
 */
// 1.1
async.auto({
    getData: function (callback) {
        setTimeout(function(){
            console.log('1.1: got data');
             callback(null, 'mydata');
        }, 300);
    },
    makeFolder: function (callback) {
        setTimeout(function(){
            console.log('1.1: made folder');
            callback(null, 'myfolder');
        }, 200);
    },
    writeFile: ['getData', 'makeFolder', function(callback) {
        setTimeout(function(){
            console.log('1.1: wrote file');
            callback(null, 'myfile');
        }, 300);
    }],
    emailFiles: ['writeFile', function(callback, results) {
        log('1.1: emailed file: ', results.writeFile);
        callback(null, results.writeFile);
    }]
}, function(err, results) {
    log('1.1: err: ', err);
    log('1.1: results: ', results);
});
//1.1: made folder
//1.1: got data
//1.1: wrote file
//20.120> 1.1: emailed file: myfile
//20.125> 1.1: err: null
//20.127> 1.1: results: { makeFolder: 'myfolder',
//    getData: 'mydata',
//    writeFile: 'myfile',
//    emailFiles: 'myfile' }



/**
* 如果中途出错，则会把错误交给最终callback，执行完任务的传给最终callback。未执行完成的函数值被忽略
*/
// 1.2
async.auto({
    getData: function (callback) {
        setTimeout(function(){
            console.log('1.2: got data');
            callback(null, 'mydata');
        }, 300);
    },
    makeFolder: function (callback) {
        setTimeout(function(){
            console.log('1.2: made folder');
            callback(null, 'myfolder');
        }, 200);
    },
    writeFile: ['getData', 'makeFolder', function(results, callback) {
        setTimeout(function(){
            console.log('1.2: wrote file');
            callback('myerr');
        }, 300);
    }],
    emailFiles: ['writeFile', function(results, callback) {
        console.log('1.2: emailed file: ' + results.writeFile);
        callback('err sending email', results.writeFile);
    }]
}, function(err, results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});
//1.2: made folder
//1.2: got data
//1.2: wrote file
//51.399> 1.2 err: myerr
//51.401> 1.2 results: { makeFolder: 'myfolder',
//    getData: 'mydata',
//    writeFile: undefined }
