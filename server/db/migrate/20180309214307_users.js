
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments()
    table.string('account').notNullable().unique()
    table.string('first_name')
    table.string('last_name')
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.string('avatar_url')
    table.boolean('admin')
    table.timestamps()
  })  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
