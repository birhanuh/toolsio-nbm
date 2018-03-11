
exports.up = function(knex, Promise) {
  return knex.schema.table('projects', function(table) {
    table.integer('customer_id')  
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('projects', function(table) {
    table.t.dropColumn('customer_id')
  })
};
