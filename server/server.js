var https = require('https');
var fs = require('fs');
var pg = require('pg');

if (process.env.DATABASE_URL) { 
  pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client) {
    if (err) throw err;
    console.log('Connected to postgres! Getting schemas...');

    client
      .query('SELECT table_schema,table_name FROM information_schema.tables;')
      .on('row', function(row) {
        console.log(JSON.stringify(row));
      });
  });
}

var app = require('./server_config');

var options = {
  key: fs.readFileSync(__dirname + '/../key.pem'),
  cert: fs.readFileSync(__dirname + '/../cert.pem')
};

var port = process.env.PORT || 8443;

https.createServer(options, app).listen(port);

//refactor above to use process.env variables