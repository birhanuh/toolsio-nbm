
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.boolean('confirmed')  
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.t.dropColumn('confirmed')
  })
};
