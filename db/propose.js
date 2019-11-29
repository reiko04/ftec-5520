/*
 定义一个user的Schema
*/
const mongoose = require('./db.js');
const Schema = mongoose.Schema;

// 创建一个模型
const ProposeSchema = new Schema({
    borrower: {type: String},
    lender: {type: String},
    record: {type: ObjectId}
});

// 导出model模块
const User = module.exports = mongoose.model('Propose', ProposeSchema);


