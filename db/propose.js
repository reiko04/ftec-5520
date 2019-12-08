/*
 定义一个user的Schema
*/
const mongoose = require('./db.js');
const Schema = mongoose.Schema;

// 创建一个模型
const ProposeSchema = new Schema({
    borrower: {type: ObjectId, ref:'User'},
    lender: {type: ObjectId, ref:'User'},
    record: {type: ObjectId, ref:'Record'}
});

// 导出model模块
const Propose = module.exports = mongoose.model('Propose', ProposeSchema);


