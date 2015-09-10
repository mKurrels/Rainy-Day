var https = require('https');
var fs = require('fs');



var app = require('./server_config');


var options = {
  key: fs.readFileSync(__dirname + '/../key.pem'),
  cert: fs.readFileSync(__dirname + '/../cert.pem')
};

var port = process.env.PORT || 8443;

https.createServer(options, app).listen(8443);

//refactor above to use process.env variables