const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const modalidades = await connection('modalidades')        
        .orderBy('modDescricao')
        .select('*');
    
        return response.json(modalidades);
    },    
        
    async create(request, response) {
        console.log(request.body);
        const {modDescricao} = request.body;
        const [modId] = await connection('modalidades').insert({
            modDescricao, 
        });
           
        return response.json({modId});
    },

    async dadModalidade (request, response) {        
        let id = request.params.modId;
        const modalidade = await connection('modalidades')
        .where('modId', id)
        .orderBy('modDescricao')
        .select('*');

        return response.json(modalidade);
    },

    async updModalidade(request, response) {
        let id = request.params.modId;        
        const {modDescricao} = request.body;

        await connection('modalidades')
        .where('modId', id)
        .update({
            modDescricao,
        });
           
        return response.status(204).send();
    },
};
