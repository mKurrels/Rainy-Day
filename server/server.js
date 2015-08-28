var express = require('express');
var app = express();

app.use(express.static('../public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/auth', function (req, res) {
  res.redirect('https://sandbox-api.venmo.com/v1/oauth/authorize?client_id=2887&scope=access_profile');
});

var port = 3000;

app.listen(port);
module.exports = app;

console.log('family fund server listening on port ' + port);