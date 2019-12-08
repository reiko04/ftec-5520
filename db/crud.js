const express = require('express');

const router = express.Router();
var app = express();
var bodyParser = require('body-parser');
const User = require('./user');
const Record = require('./record')

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
  console.log(user);
  res.send(user);
});

router.post('/postborrowrecord',async(req, res) => {
  console.log(req.body);
  var borrower = undefined;
  if (req.body.borrower != undefined) {
    borrower = await User.findOne({username:req.body.borrower}).exec();
    console.log(borrower);
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

router.get('/getborrowrecord', async(req, res) => {
  console.log(req.query);
  var username = req.query.username;
  user = await User.findOne({username:username}).exec();
  records = await Record.find({borrower:user._id});
  console.log(records);
  res.send(records);
});

router.get('/getuserbyid', async(req, res) => {
  var userid = req.query.userid;
  user = await User.findById(userid);
  res.send(user);
});

router.get('/getloan', async(req, res) => {
  var borrower_name = req.query.borrower;
  var lender_name = req.query.lender;
  var established = req.query.established;
  var loan = undefined;
  console.log(req.query);
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