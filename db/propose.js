/*
 定义一个user的Schema
*/
const mongoose = require('./db.js');
const Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

// 创建一个模型
const ProposeSchema = new Schema({
    borrower: {type: ObjectId, ref:'User'},
    lender: {type: ObjectId, ref:'User'},
    interestRate: {type: Number},
    maturity: {type:Number}
});

// 导出model模块
const Propose = module.exports = mongoose.model('Propose', ProposeSchema);


