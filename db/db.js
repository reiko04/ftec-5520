var mongoose = require('mongoose');
var DB_URL = 'mongodb+srv://ftec5520:ftec5520@esocluster-90004.mongodb.net/test?retryWrites=true&w=majority';

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/* 链接 */
mongoose.connect(DB_URL);

/* 链接成功 */
mongoose.connection.on('connected', function() {
  console.log('Mongoose connection open to ' + DB_URL);
});

// 链接异常
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error:' + err);
});

// 链接断开

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose connection disconnected');
});

module.exports = mongoose;



