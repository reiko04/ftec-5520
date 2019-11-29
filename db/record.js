/*
 定义一个user的Schema
*/
const mongoose = require('./db.js');
const Schema = mongoose.Schema;

// 创建一个模型
const RecordSchema = new Schema({
  borrower: {type: String, unique:true},
  lender: {type: String},
  interestRate: {type: Number},
  amount:{type: Number},
  purpose: {type: String},
  maturity: {type: Number}
});

// 导出model模块
const User = module.exports = mongoose.model('Record', RecordSchema);



