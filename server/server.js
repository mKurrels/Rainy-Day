var https = require('https');
var fs = require('fs');



var app = require('./server_config');


var options = {
  key: fs.readFileSync(__dirname + '/../key.pem'),
  cert: fs.readFileSync(__dirname + '/../cert.pem')
};

https.createServer(options, app).listen(8443);