const {log} = require('sails');

exports.up = (knex, Promise) => {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
};

exports.down = (knex, Promise) => {
  log.warn('\n  Irreversible Migration\n');
  return knex.schema;
};
