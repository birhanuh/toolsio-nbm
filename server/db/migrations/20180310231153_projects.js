
exports.up = function(knex, Promise) {
  return knex.schema.createTable('projects', function(table) {
    table.increments()
    table.string('name').notNullable()
    table.datetime('deadline').notNullable()
    table.string('status')
    table.text('description')
    table.integer('progress')
    table.integer('total')
    table.integer('tasks')
    table.timestamps()
  })  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('projects')
};
