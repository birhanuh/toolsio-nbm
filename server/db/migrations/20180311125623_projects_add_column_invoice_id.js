
exports.up = function(knex, Promise) {
  return knex.schema.table('projects', function(table) {
    table.boolean('invoice_id')  
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('projects', function(table) {
    table.t.dropColumn('invoice_id')
  })
};
