var express = require('express');
var https = require('https');
var reqHandlers = require('./request_handlers');
var bodyParser = require('body-parser');
var api = require('./router');
var morgan = require('morgan');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use('/api', api);
app.use(morgan('dev'));

var options = {
  key: fs.readFileSync(__dirname + '/../key.pem'),
  cert: fs.readFileSync(__dirname + '/../cert.pem')
};

https.createServer(options, app).listen(8443);






module.exports = app;