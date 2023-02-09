const { Console } = require('console');
const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const atletas = await connection('atletas')
        .orderBy('atlNome')
        .select('*');
    
        return response.json(atletas);
    },    
        
    async create(request, response) {
        console.log(request.body);        
        const {atlNome, 
            atlNascimento, 
            atlCpf, 
            atlIdentidade, 
            atlOrgEmissor, 
            atlNatural, 
            atlEstCivil, 
            atlNomPai, 
            atlNomMae, 
            atlEndereco,
            atlIdEquipe} = request.body;
        var status = 'A'; 
        const [atlId] = await connection('atletas').insert({
            atlNome, 
            atlNascimento, 
            atlCpf, 
            atlIdentidade, 
            atlOrgEmissor, 
            atlNatural, 
            atlEstCivil, 
            atlNomPai, 
            atlNomMae, 
            atlEndereco,
            atlIdEquipe,
            atlStatus: status
        });
           
        return response.json({atlId});
    },

    async atlEquipe (request, response) {        
        let id = request.params.idEqu;
        let status = 'A';

        //console.log('Equipe:',id)

        const atletas = await connection('atletas')
        .where('atlStatus', status)
        .where('atlIdEquipe', id)
        .join('equipes', 'equId', 'atletas.atlIdEquipe')
        .orderBy('atlNome')
        .select(['atletas.*', 'equipes.equDescricao']);

        //console.log(atletas)

        return response.json(atletas);
    },

    async busAtleta (request, response) {        
        let id = request.params.atlId;
        let status = 'A';
        const atleta = await connection('atletas')
        .where('atlStatus', status)
        .where('atlId', id)
        .join('equipes', 'equId', 'atletas.atlIdEquipe')
        .join('eventos', 'eveId', 'equipes.equIdEvento')
        .join('modalidades', 'modId', 'eventos.eveModalidade')
        .orderBy('atlNome')
        .select(['atletas.*', 'equipes.equDescricao', 'eventos.eveDescricao', 'eventos.eveModalidade', 'modalidades.modDescricao']);

        return response.json(atleta);
    },

    async dadAtleta (request, response) {        
        let id = request.params.atlId;
        let status = 'A';
        const atleta = await connection('atletas')
        .where('atlId', id)
        .where('atlStatus', status)
        .join('equipes', 'equId', 'atletas.atlIdEquipe')
        .orderBy('atlNome')
        .select(['atletas.*', 'equipes.equDescricao']);

        return response.json(atleta);
    },

    async updAtleta(request, response) {
        let id = request.params.atlId;        
        const { atlNome, 
            atlNascimento, 
            atlCpf, 
            atlIdentidade, 
            atlOrgEmissor, 
            atlNatural, 
            atlEstCivil, 
            atlNomPai, 
            atlNomMae, 
            atlEndereco,
            atlIdEquipe } = request.body;

        await connection('atletas')
        .where('atlId', id)
        .update({
            atlNome, 
            atlNascimento, 
            atlCpf, 
            atlIdentidade, 
            atlOrgEmissor, 
            atlNatural, 
            atlEstCivil, 
            atlNomPai, 
            atlNomMae, 
            atlEndereco,
            atlIdEquipe,
        });
           
        return response.status(204).send();
    },

};
