
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.renameColumn('confirmed', 'is_confirmed');
  })  
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.renameColumn('is_confirmed', 'confirmed');
  })  
};
