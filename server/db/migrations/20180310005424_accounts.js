
exports.up = function(knex, Promise) {
  return knex.schema.createTable('accounts', function(table) {
    table.increments()
    table.string('subdomain').notNullable().unique()
    table.string('industry').notNullable()
    table.string('phone_number')
    table.string('email')
    table.string('street').notNullable()
    table.string('postal_code')
    table.string('region')
    table.string('country')
    table.string('logo')
    table.timestamps()
  })  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('accounts')
};
