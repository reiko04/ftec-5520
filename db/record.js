/*
 定义一个user的Schema
*/
const mongoose = require('./db.js');
const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
// 创建一个模型
const RecordSchema = new Schema({
  borrower: {type:ObjectId, ref:'User'},
  lender: {type: ObjectId, ref:'User'},
  interestRate: {type: Number},
  amount:{type: Number},
  purpose: {type: String},
  maturity: {type: Number},
  request_list: [{type:ObjectId, ref:'User'}]
});

// 导出model模块
const Record = module.exports = mongoose.model('Record', RecordSchema);



