

if (process.env.DATABASE_URL) {
  var url = process.env.DATABASE_URL || require('../api').url;
  var config = {
    client: 'pg',
    connection: url + "?ssl=true"
  }; 
} else {
  var config = {
    client: 'sqlite3',
    connection: {
      filename: __dirname + "/ff.sqlite"
    }
  }; 
}


var knex = require('knex')(config);

db = (require('bookshelf')(knex));

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    console.log('nope, doesnt exist');
    return knex.schema.createTable('users', function(t) {
      t.string('id').primary();
      t.decimal('balance');
      t.string('group_id');
      t.string('token');
      t.timestamps();
      t.integer('loan_id').references('id').inTable('loans');
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
      t.string('type');
      t.timestamps();
      t.string('user_id').references('id').inTable('users');
      t.integer('loan_id').references('id').inTable('loans');
    })
    .then(function(transactions){
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
      t.decimal('amount_paid');
      t.decimal('interest');
      t.integer('duration');
      t.string('status');
      t.timestamps();
      t.string('user_id').references('id').inTable('users');
    })
    .then(function(loans){
      console.log('Create Table loans');
    }).catch(function(err){
      console.log('error creating table loans: ', err);
    });
  }
});

db.knex.schema.hasTable('groups').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('groups', function(t) {
      t.string('id').primary();
      t.decimal('balance');
      t.decimal('available_balance');
      t.timestamps();
    })
    .then(function(groups){
      console.log('Create Table loans');
    }).catch(function(err){
      console.log('error creating table loans: ', err);
    });
  }
});


exports.db = db;