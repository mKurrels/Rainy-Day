var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: __dirname + "/ff.sqlite"
  }
});

db = require('bookshelf')(knex);

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    console.log('nope, doesnt exist');
    return knex.schema.createTable('users', function(t) {
      t.increments('id').primary();
      t.string('venmoID');
      t.decimal('value');
      t.boolean('isManager');
    });
  } else {
    console.log('yep, users exists!!!');
  }
});

db.knex.schema.hasTable('pots').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('pots', function(t) {
      t.increments('id').primary();
      t.string('venmoID');
      t.decimal('value');
    });
  } else {
    console.log('yep, pot exists!!!');
  }
});

//hi
exports.db = db;