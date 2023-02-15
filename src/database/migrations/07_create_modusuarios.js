exports.up = function(knex) {
    return knex.schema.createTable('usrAceModal', function(table) {
        table.increments('aceId').primary();
        table.string('usrUsrId').notNullable();
        table.string('usrModId').notNullable(); 
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('usrAceModal');
};