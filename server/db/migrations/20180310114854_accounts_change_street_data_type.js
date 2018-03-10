
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('accounts', function(table) {
    table.string('street').nullable().alter();
  })  
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('accounts', function(table) {
    table.string('street').notNullable().notNullable().alter();
  })  
};
