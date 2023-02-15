exports.up = function(knex) {
    return knex.schema.createTable('equipes', function(table) {
        table.increments('equId').primary();
        table.string('equDescricao').notNullable(); 
        table.integer('equIdEvento').notNullable();
        table.string('equRegiao').nullable();  
        table.string('equResp').nullable(); 
        table.integer('equTecnico').nullable();
        table.string('equDirigente').nullable();  
        table.string('equStatus').nullable();     
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('equipes');
};
