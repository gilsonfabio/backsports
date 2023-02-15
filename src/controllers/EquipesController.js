const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const equipes = await connection('equipes')
        .join('eventos', 'eveId', 'equipes.equIdEvento')
        .join('tecnicos', 'tecId', 'equipes.equTecnico')
        .orderBy('equDescricao')
        .select(['equipes.*', 'eventos.eveDescricao', 'tecnicos.tecNome', 'tecnicos.tecCelular', 'tecnicos.tecEmail']);
          
        return response.json(equipes);
    },    
        
    async create(request, response) {
        console.log(request.body);
        const {equDescricao, equIdEvento, equRegiao, equResp, equTecnico, equDirigente} = request.body;
        let status = 'A'; 
        const [equId] = await connection('equipes').insert({
            equDescricao,
            equIdEvento, 
            equRegiao, 
            equResp, 
            equTecnico, 
            equDirigente, 
            equStatus: status
        });
           
        return response.json({eveId});
    },

    async equEvento (request, response) {        
        let id = request.params.idEve;
        let status = 'A';
        const equipes = await connection('equipes')
        .where('equStatus', status)
        .where('equIdEvento', id)
        .join('eventos', 'eveId', 'equipes.equIdEvento')
        .join('tecnicos', 'tecId', 'equipes.equTecnico')
        .orderBy('equDescricao')
        .select(['equipes.*', 'eventos.eveDescricao', 'tecnicos.tecNome', 'tecnicos.tecCelular', 'tecnicos.tecEmail']);

        return response.json(equipes);
    },

    async admEquipes (request, response) {        
        let id = request.params.idEve;
        let status = 'A';
        if (id == 0){
            const equipes = await connection('equipes')
            .where('equStatus', status)
            .join('eventos', 'eveId', 'equipes.equIdEvento')
            .join('tecnicos', 'tecId', 'equipes.equTecnico')
            .orderBy('equDescricao')
            .select(['equipes.*', 'eventos.eveDescricao', 'tecnicos.tecNome', 'tecnicos.tecCelular', 'tecnicos.tecEmail']);
            return response.json(equipes);
        }else{
            const equipes = await connection('equipes')
            .where('equStatus', status)
            .where('equIdEvento', id)
            .join('eventos', 'eveId', 'equipes.equIdEvento')
            .join('tecnicos', 'tecId', 'equipes.equTecnico')
            .orderBy('equDescricao')
            .select(['equipes.*', 'eventos.eveDescricao', 'tecnicos.tecNome', 'tecnicos.tecCelular', 'tecnicos.tecEmail']); 
            return response.json(equipes);
        }
    },

    async dadEquipe (request, response) {        
        let id = request.params.idEqu;
        let status = 'A';
        const equipe = await connection('equipes')
        .where('equStatus', status)
        .where('equId', id)
        .join('eventos', 'eveId', 'equipes.equIdEvento')
        .join('tecnicos', 'tecId', 'equipes.equTecnico')
        .join('atletas', 'atlIdEquipe', 'equipes.equId')
        .count({qtd: '*'})
        .orderBy('equDescricao')
        .select(['equipes.*', 'eventos.eveDescricao', 'eventos.eveNroEquipes', 'tecnicos.tecNome', 'tecnicos.tecCelular', 'tecnicos.tecEmail']);
         
        console.log(equipe);
          
        return response.json(equipe);
    },

    async updEquipe(request, response) {
        let id = request.params.idEqu;        
        const {equDescricao, equIdEvento, equRegiao, equResp, equDirigente} = request.body;

        await connection('equipes')
        .where('equId', id)
        .update({
            equDescricao,
            equIdEvento, 
            equRegiao, 
            equResp, 
            equDirigente, 
        });
           
        return response.status(204).send();
    },

};
