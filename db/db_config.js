// var Promise  = require('bluebird');

var url = process.env.DATABASE_URL || require('../api').url;
var config = {
  client: 'pg',
  connection: url + "?ssl=true"
};

// var config = {
//   client: 'sqlite3',
//   connection: {
//     filename: __dirname + "/ff.sqlite"
//   }
// };

// if (process.env.DATABASE_URL) {
  // config.client = 'pg';
  // config.connection = {
  //   host: process.env.DATABASE_HOST,
  //   user: process.env.DATABASE_USER,
  //   password: process.env.DATABASE_PW,
  //   database: process.env.DATABASE,
  //   // ssl: true,
  //   charset: 'utf8'
  // };
// }

var knex = require('knex')(config);

db = /*Promise.promisifyAll*/(require('bookshelf')(knex));

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    console.log('nope, doesnt exist');
    return knex.schema.createTable('users', function(t) {
      t.increments('id').primary();
      t.integer('balance');
      t.integer('group_id');
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
      t.integer('user_id').references('id').inTable('users');
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
      t.integer('user_id').references('id').inTable('users');
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
      t.increments('id').primary();
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


//hi
exports.db = db;