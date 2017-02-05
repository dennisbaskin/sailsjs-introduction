const {log} = require('sails');

exports.up = (knex, Promise) => {
  return knex.schema.dropTableIfExists('public.user');
};

exports.down = (knex, Promise) => {
  log.warn('\n  Irreversible Migration\n');
  return knex.schema;
};
