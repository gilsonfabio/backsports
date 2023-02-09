exports.up = function(knex) {
    return knex.schema.createTable('tecnicos', function(table) {
        table.increments('tecId').primary();
        table.string('tecNome').notNullable();
        table.string('tecEmail').notNullable(); 
        table.string('tecSenha').notNullable();
        table.integer('tecNivAcesso').notNullable();     
        table.string('tecStatus').notNullable(); 
        table.string('tecCodSeguranca').nullable();      
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('tecnicos');
};