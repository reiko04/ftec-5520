const express = require('express');

const router = express.Router();
var app = express();
var bodyParser = require('body-parser');
const User = require('./user');

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

module.exports = router