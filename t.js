exports.inc = function(n, callback) {
    setTimeout(function() {
        callback(null, n+1);
    }, 200);
};

exports.fire = function(obj, callback) {
    setTimeout(function() {
        callback(null, obj);
    }, 200);
};

exports.err = function(errMsg, callback) {
    setTimeout(function() {
        callback(errMsg);
    }, 200);
};

// utils
exports.log = function(msg, obj) {
    process.stdout.write(msg);
    console.log(obj);
};