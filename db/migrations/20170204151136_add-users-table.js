exports.up = (knex, Promise) => {
  return knex.schema

    .dropTableIfExists('users')

    .createTable('users', (table) => {
      table.increments();

      table.string('username')
        .unique()
        .notNullable();

      table.string('email')
        .unique()
        .notNullable();

      table.uuid('uuid')
        .notNullable()
        .defaultTo(knex.raw('uuid_generate_v4()'));

      table.string('password')
        .notNullable();

      table.timestamps();
    });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('users');
};
