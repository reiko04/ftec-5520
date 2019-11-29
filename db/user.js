/*
 定义一个user的Schema
*/
const mongoose = require('./db.js');
const Schema = mongoose.Schema;

// 创建一个模型
const UserSchema = new Schema({
  username: { type: String}, // 属性name，类型为String
  password: {type: String},
  university: {type: String},
  identity: {type: String}, // borrower or lender
  occupation: {type: String},
  studentID: {type: String},
  rating: { type: Number, default:3}
});

// 导出model模块
const User = module.exports = mongoose.model('User', UserSchema);



