var Promise  = require('bluebird');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: __dirname + "/ff.sqlite"
  }
});


db = Promise.promisifyAll(require('bookshelf')(knex));

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    console.log('nope, doesnt exist');
    return knex.schema.createTable('users', function(t) {
      t.increments('id').primary();
      t.string('venmoID');
      t.boolean('isManager');
      t.string('group_id');
      t.timestamps();
      // t.integer('pot_id').references('id').inTable('pots');
      // t.date('createdAt');
      // t.date('updatedAt');
    });
  } else {
    console.log('yep, users exists!!!');
  }
});

db.knex.schema.hasTable('transactions').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('transactions', function(t) {
      t.increments('id').primary();
      t.decimal('value');
      t.timestamps();
      t.integer('user_id').references('id').inTable('users');
      t.integer('loan_id').references('id').inTable('loans');
    })
    .then(function(photos){
      console.log('Create Table transactions');
    }).catch(function(err){
      console.log('error creating table transactions: ', err);
    });
  }
});

db.knex.schema.hasTable('loans').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('loans', function(t) {
      t.increments('id').primary();
      t.decimal('principle');
      t.decimal('interest');
      t.integer('duration');
      t.string('status');
      t.timestamps();
      t.integer('user_id').references('id').inTable('users');
    })
    .then(function(photos){
      console.log('Create Table loans');
    }).catch(function(err){
      console.log('error creating table loans: ', err);
    });
  }
});
// db.knex.schema.hasTable('pots').then(function(exists) {
//   if (!exists) {
//     return knex.schema.createTable('pots', function(t) {
//       t.increments('id').primary();
//       t.string('venmoID');
//       t.decimal('value');
//       t.timestamps();
//       // t.date('createdAt');
//       // t.date('updatedAt');
//     });
//   } else {
//     console.log('yep, pot exists!!!');
//   }
// });


//hi
exports.db = db;