exports.up = function(knex) {
    return knex.schema.createTable('eventos', function(table) {
        table.increments('eveId').primary();
        table.integer('eveIdModalidade').notNullable(); 
        table.string('eveDescrição').notNullable();
        table.integer('eveAno').nullable();  
        table.date('eveDatInicial').nullable(); 
        table.date('eveDatFinal').nullable();
        table.integer('eveNroEquipes').nullable();  
        table.string('eveGenero').nullable();     
        table.string('eveStatus').nullable();      
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('eventos');
};