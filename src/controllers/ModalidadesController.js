const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {       
    
    async index (request, response) {
        const modalidades = await connection('modalidades')
        .select('modId', 'modDescricao');
    
        return response.json(modalidades);
    },
    
    async modUsuario (request, response) {        
        let id = request.params.idUsr;
        const usuario = await connection('usrAceModal')
        .where('aceUsrId', id)
        .join('modalidades', 'modId', 'usrAceModal.aceModId')
        .select(['usrAceModal.*', 'modalidades.modId', 'modalidades.modDescricao']);

        return response.json(usuario);
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
