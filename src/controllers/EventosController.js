const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const eventos = await connection('eventos')
        .join('modalidades', 'modId', 'eventos.eveModalidade')
        .orderBy('eveDatInicial')
        .select(['eventos.*', 'modalidades.modDescricao']);
    
        return response.json(eventos);
    },    
        
    async create(request, response) {
        //console.log(request.body);
        const {eveModalidade, eveDescricao, eveAno, eveDatInicial, eveDatFinal, eveNroEquipes, eveGenero } = request.body;
        let status = 'A'; 
        const [eveId] = await connection('eventos').insert({
            eveModalidade, 
            eveDescricao, 
            eveAno, 
            eveDatInicial, 
            eveDatFinal, 
            eveNroEquipes, 
            eveGenero, 
            eveStatus: status
        });
           
        return response.json({eveId});
    },

    async eveModal (request, response) {
        
        let id = request.params.idMod;
        let status = 'A';
        const eventos = await connection('eventos')
        .where('eveStatus', status)
        .where('eveModalidade', id)
        .join('modalidades', 'modId', 'eventos.eveModalidade')
        .orderBy('eveDatInicial')
        .select(['eventos.*', 'modalidades.modDescricao']);

        return response.json(eventos);
    },

    async dadEvento (request, response) {        
        let id = request.params.idEve;
        const evento = await connection('eventos')
        .where('eveId', id)
        .join('modalidades', 'modId', 'eventos.eveModalidade')
        .orderBy('eveDescricao')
        .select(['eventos.*', 'modalidades.modDescricao']);

        return response.json(evento);
    },
};
