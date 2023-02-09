exports.up = function(knex) {
    return knex.schema.createTable('atletas', function(table) {
        table.increments('atlId').primary();
        table.string('atlNome').notNullable(); 
        table.date('atlNascimento').nullable();  
        table.string('atlCpf').nullable();  
        table.string('atlIdentidade').nullable();  
        table.string('atlOrgEmissor').nullable();  
        table.string('atlNatural').nullable();  
        table.string('atlEstCivil').nullable();  
        table.string('atlNomPai').nullable();  
        table.string('atlNomMae').nullable();  
        table.string('atlEndereco').nullable(); 
        table.integer('atlIdEquipe').nullable();     
        table.string('atlStatus').nullable();  
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('atletas');
};