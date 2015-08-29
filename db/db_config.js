var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./ff.sqlite"
  }
});

knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    console.log('nope, doesnt exist');
    return knex.schema.createTable('users', function(t) {
      t.increments('id').primary();
      t.string('venmoID');
      t.decimal('value');
      t.boolean('isManager');
      t.integer('fund_id');
    });
  }
});

exports.bookshelf = require('bookshelf')(knex);