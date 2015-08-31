var express = require('express');
var app = express();
var reqHandlers = require('./request_handlers');
var bodyParser = require('body-parser');
console.log(reqHandlers, 'reqHndlers');
console.log("_______________", __dirname);

app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

app.post('/payment', function (req, res) {
  console.log('payment maid dude!', req.body);
});

app.post('/user', reqHandlers.postUser);

app.get('/user', reqHandlers.getAllUsers);

app.get('/auth', function (req, res) {
  res.redirect('https://sandbox-api.venmo.com/v1/oauth/authorize?client_id=2887&scope=access_profile');
});

var port = 3000;

app.listen(port);
module.exports = app;

console.log('family fund server listening on port ' + port);