var async = require('async');

var t = require('./t');
var log = t.log;

/** 
 * ����ȡ�ü��������������ĵ�һ��Ԫ�ء�����Ϊ������˳��ִ�����ַ�ʽ���ֱ��Ӧ����detect��detectSeries��
 */

// detect(array, iterator(item,callback(test)), callback(result)
var arr = [{value:1,delay:500},
           {value:2,delay:200},
           {value:3,delay:300}];
async.detect(arr, function(item,callback){
    log('1.1 enter: ', item.value);
    t.inc(item.value, function(err,n) {
        log('1.1 handle: ', item.value);
        callback(n%2===0);
    }, item.delay);
}, function(result) {
    log('1.1 result: ', result);
});
// 09.928> 1.1 enter: 1
// 09.928> 1.1 enter: 2
// 09.928> 1.1 enter: 3
// 10.138> 1.1 handle: 2
// 10.228> 1.1 handle: 3
// 10.228> 1.1 result: { value: 3, delay: 300 }
// 10.438> 1.1 handle: 1
// 10.438> 1.1 handle: 1

async.detectSeries(arr, function(item,callback) {
    log('1.2 enter: ', item.value);
    t.inc(item.value, function(err,n) {
        log('1.1 handle: ', item.value);
        callback(n%2===0);
    }, item.delay);
}, function(result) {
    log('1.2 result: ', result);
});
// 09.928> 1.2 enter: 1
// 10.438> 1.2 result: { value: 1, delay: 500 }
