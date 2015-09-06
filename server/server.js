var express = require('express');
var app = express();
var reqHandlers = require('./request_handlers');
var bodyParser = require('body-parser');
var api = require('./router');
var morgan = require('morgan');


app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api', api);


var port = 3000;
app.listen(port);
module.exports = app;


console.log('family fund server listening on port ' + port);