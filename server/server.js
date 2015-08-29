var express = require('express');
var app = express();
var reqHandlers = require('./request_handlers');
var bodyParser = require('body-parser');

app.use(express.static('../public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/user', function(req, res) {
  console.log('recieving request data of: ', req.body);
  res.send('Hello World!');
});

app.post('/user', reqHandlers.getUser);

app.get('/auth', function (req, res) {
  res.redirect('https://sandbox-api.venmo.com/v1/oauth/authorize?client_id=2887&scope=access_profile');
});

var port = 3000;

app.listen(port);
module.exports = app;

console.log('family fund server listening on port ' + port);