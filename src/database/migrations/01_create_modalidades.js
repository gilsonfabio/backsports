exports.up = function(knex) {
    return knex.schema.createTable('modalidades', function(table) {
        table.increments('modId').primary();        
        table.string('modDescrição').notNullable();    
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('modalidades');
};