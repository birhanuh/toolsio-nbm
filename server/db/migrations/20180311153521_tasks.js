
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tasks', function(table) {
    table.increments()
    table.string('name').notNullable()
    table.integer('hours').notNullable()
    table.string('payment_type').notNullable()
    table.integer('price').notNullable()
    table.integer('vat').notNullable()
    table.integer('project_id').notNullable()
    table.timestamps()
  })  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tasks')
};
