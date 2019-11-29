var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

// mongoose.Promise = global.Promise; 
/* using mongoose promises rather than callbacks*/

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

const crud = require("./db/crud")

var port = process.env.PORT || 3001;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({message: 'welcome to our api!'});
});

app.use('/api', crud);

// mongoose.connect('mongodb+srv://ftec5520:ftec5520@esocluster-90004.mongodb.net/test?retryWrites=true&w=majority', function (err) {
//     if (err) {
//         console.log(err, "数据库连接失败");
//         return;
//     }
//     console.log('数据库连接成功');

//     app.listen(port, function (err) {
//         if (err) {
//             console.error('err:', err);
//         } else {
//             console.info(`===> api server is running at localhost:27017`)
//         }
//     });
// });

app.listen(port);
console.log('port: ' + port);

