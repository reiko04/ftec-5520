var express = require('express');
var app = express();
var bodyParser = require('body-parser');

import mongoose from 'mongoose';

mongoose.Promise = global.Promise; 
/* using mongoose promises rather than callbacks*/

function openDatabaseConnection() {
  mongoose.connect("mongodb+srv://ftec5520:ftec5520@esocluster-90004.mongodb.net/test?retryWrites=true&w=majority", (err) => {
    if (err) {
      console.log("Error when connecting:", err);
    } else {
      console.log("Server connected to the database.");
    }
  });
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({message: 'welcome to our api!'});
});

app.use('/api', router);

app.listen(port);
console.log('port: ' + port);

