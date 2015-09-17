var https = require('https');
var http = require('http');
var fs = require('fs');
var pg = require('pg');

var url = process.env.DATABASE_URL || require('../api').url;

if (process.env.DATABASE_URL) {
  pg.connect(url + "?ssl=true", function(err, client) {
    if (err) throw err;
    console.log('Connected to postgres! Getting schemas...');

    client
      .query('SELECT table_schema,table_name FROM information_schema.tables;')
      .on('row', function(row) {
        // console.log(JSON.stringify(row));
      });
  });
}


var app = require('./server_config');

var options = {
  key: process.env.keypem || fs.readFileSync(__dirname + '/../key.pem'),
  cert: process.env.certpem || fs.readFileSync(__dirname + '/../cert.pem')
};

// console.log('**********************************', options);

var port = process.env.PORT || 8443;

if (process.env.DATABASE_URL) {
  app.listen(port);
} else {
  https.createServer(options, app).listen(port);
}

//refactor above to use process.env variables