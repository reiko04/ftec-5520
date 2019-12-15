const express = require('express');

const router = express.Router();
var app = express();
var bodyParser = require('body-parser');
const User = require('./user');
const Record = require('./record');
const Propose = require('./propose');

router.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

router.post('/signup', (req, res) => {
  // console.log(req.body);
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    university: req.body.university,
    identity: req.body.identity, // borrower or lender
    occupation: req.body.occupation,
    studentID: req.body.studentID,
    rating: 3
  });
  user.save((err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ "code": 0, 'message': '新增成功' });
    }
  });
});

router.post('/login', async (req, res) => {
  const username = req.body.username,
        password = req.body.password;
  try {
    var user = await User.findOne({username:username, password:password}).exec();
  } catch (err) {
    res.send(err);
  }
  // var user = User.findOne({username:username, password:password});
  if (!user) {
    res.send("Incorrect username or password!");
  }
  // console.log(user);
  res.send(user);
});

router.post('/postborrowrecord',async(req, res) => {
  // console.log(req.body);
  var borrower = undefined;
  if (req.body.borrower != undefined) {
    borrower = await User.findOne({username:req.body.borrower}).exec();
    // console.log(borrower);
  }
  const record = new Record ({
    borrower: borrower._id,
    interestRate: req.body.interest,
    amount : req.body.amount,
    purpose : req.body.purpose,
    maturity: req.body.maturity
  });
  record.save((err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ "code": 0, 'message': '新增成功' });
    }
  });
});

router.post('/postlendproposal', async(req, res) => {
  console.log(req.body);
  var lender = undefined;
  var record_id = req.body.recordid;
  if (req.body.lender != undefined) {
    lender = await User.findOne({username:req.body.lender}).exec();
    console.log(lender);
  }
  const propose = new Propose ({
    lender: lender._id,
    interestRate: req.body.interest,
    maturity: req.body.maturity
  });
  propose.save((err, docs) => {
    if (err) {
      res.send(err);
    } else {
      console.log(docs);
      Record.findOneAndUpdate({_id: record_id}, {$push: {request_list: docs}}).exec();
      res.send({ "code": 0, 'message': '新增成功' });
    }
  });
});

router.put('/updateborrowrecord', async(req, res) => {
  console.log(req.body);
  var recordid = req.body.recordid;
  var lender = await User.findOne({username:req.body.lender}).exec();
  var interestRate = req.body.interest;
  var maturity = req.body.maturity;
  try {
    Record.findOneAndUpdate({_id:recordid}, {lender:lender, interestRate:interestRate,
      maturity: maturity, startDate:Date.now()}).exec();
  } catch(err) {
    console.log(err);
    res.send(err);
  }
  res.send({ "code": 0, 'message': '更新成功' });
  
});

router.get('/getborrowrecord', async(req, res) => {
  // console.log(req.query);
  var username = req.query.username;
  user = await User.findOne({username:username}).exec();
  records = await Record.find({borrower:user._id});
  // console.log(records);
  res.send(records);
});

router.get('/getlendrecord', async(req, res) => {
  var username = req.query.username;
  user = await User.findOne({username:username}).exec();
  records = await Record.find({lender:user._id});
  res.send(records);
});

router.get('/getuserbyid', async(req, res) => {
  var userid = req.query.userid;
  user = await User.findById(userid).exec();
  // console.log(user);
  res.send(user);
});

router.get('/getrecordbyid', async(req, res) => {
  var recordid = req.query.recordid;
  record = await Record.findById(recordid);
  res.send(record);
});

router.get('/getproposebyid', async(req, res) => {
  var proposeid = req.query.proposeid;
  propose = await Propose.findById(proposeid);
  res.send(propose);
});

router.get('/getloan', async(req, res) => {
  var borrower_name = req.query.borrower;
  var lender_name = req.query.lender;
  var established = req.query.established;
  var loan = undefined;
  // console.log(req.query);
  if (established == "true") {
    if (borrower_name != undefined) {
      var borrower = await User.findOne({username:borrower_name});
      loan = await Record({borrower:borrower._id});
    } else {
      var lender = await User.findOne({username:lender_name});
      loan = await Record({borrower:lender._id});
    }
  } else if (established == "false"){
    loan = await Record.find();
  }
  res.send(loan);
});

module.exports = router