const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");
require('dotenv/config');

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {       
    async signIn(request, response) {
        let email = request.body.email;
        let senha = request.body.password;
        let encodedVal = crypto.createHash('md5').update(senha).digest('hex');
    
        const user = await connection('usuarios')
            .where('usrEmail', email)
            .where('usrPassword', encodedVal)
            .select('usrId', 'usrNome', 'usrEmail', 'usrNivAcesso')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        let refreshIdToken = uuidv4(); 
        //console.log(refreshIdToken);
                
        let token = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso }, process.env.SECRET_JWT, {
            expiresIn: "1h"
        });
        let refreshToken = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso  }, process.env.SECRET_JWT_REFRESH, {
            expiresIn: "2h" 
        });

        return response.json({user, token, refreshToken});

    },

    async index (request, response) {
        const users = await connection('usuarios')
        .orderBy('usrNome')
        .select('usrId', 'usrNome', 'usrNivAcesso', 'usrEmail');
    
        return response.json(users);
    }, 

    async create(request, response) {
        //console.log(request.body);
        const {nome, cpf, nascimento, email, celular , password, nivAcesso} = request.body;
        var status = 'A'; 
        var senha = crypto.createHash('md5').update(password).digest('hex');
        const [usrId] = await connection('usuarios').insert({
            usrNome: nome, 
            usrEmail: email, 
            usrPassword: senha,
            usrCelular: celular, 
            usrCpf: cpf, 
            usrNascimento: nascimento, 
            usrNivAcesso: nivAcesso,
            usrStatus: status
        });
           
        return response.json({usrId});
    },
    
    async refreshToken(request, response) {
        let id = request.body.idUsr;
    
        const user = await connection('usuarios')
            .where('usrId', id)
            .select('usrId', 'usrNome', 'usrEmail', 'usrNivAcesso')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        let refreshIdToken = uuidv4(); 
        
        //console.log(refreshIdToken);
                
        let token = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso }, process.env.SECRET_JWT, {
            expiresIn: "1h" 
        });
        let refreshToken = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso  }, process.env.SECRET_JWT_REFRESH, {
            expiresIn: "2h" 
        });

        return response.json({user, token, refreshToken});

    },

    //...........................................................................................................................

    async loginAdm(request, response) {
        let email = request.params.email;
        let senha = request.params.password;
        let modalidade = request.params.modId;

        var encodedVal = crypto.createHash('md5').update(senha).digest('hex');
        const user = await connection('usuarios')
            .where('usrEmail', email)
            .where('usrPassword', encodedVal)
            .select('usrId', 'usrNome', 'usrEmail', 'usrNivAcesso')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 
        
        let usuario = user.usrId;
        let nivel = user.usrNivAcesso;
        let nivLiberado ='9';
        if (nivel != nivLiberado) {
            const usrModel = await connection('usrAceModal')
                .where('aceUsrId', usuario)
                .where('aceModId', modalidade)
                .select('*')
                .first();

            if (!usrModel) {
                return response.status(404).json({ error: 'Usuário não autorizado para esse módulo'});
            }
        }

        return response.json(user);
    },

    async dadUsuario (request, response) {        
        let id = request.params.idUsr;
        const usuario = await connection('usuarios')
        .where('usrId', id)
        .select('*');

        return response.json(usuario);
    },

    async newModUsuario(request, response) {
        const {aceUsrId, aceModId} = request.body;
 
        const [aceId] = await connection('usrAceModal').insert({
            aceUsrId, 
            aceModId             
        });
           
        return response.json({aceId});
    }, 

    async solPassword (request, response) {
        let emailUsuario = request.params.email;

        //console.log('email solicitado:', emailUsuario)

        const user = await connection('usuarios')
            .where('usrEmail', emailUsuario)
            .select('usrId', 'usrNome', 'usrNivAcesso')
            .first();

        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuario com este email'});
        } 

        const arr_alfa = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","U","V","W","X","Y","Z","!","@","$","%","&","*"];
  
        let data = new Date();
        let dia = data.getDate();
        let mes = data.getMonth() + 1;
        let ano = data.getFullYear();
        let dataString = ano + '-' + mes + '-' + dia;
        let dataAtual = dataString;
         
        let hor = data.getHours();
        let min = data.getMinutes();
        let seg = data.getSeconds();
        let horaString = hor + ':' + min + ':' + seg;
        let horaAtual = horaString;
         
        let priLetra = arr_alfa[dia];
        let segLetra = arr_alfa[hor];
        let codSeguranca = priLetra + segLetra + user.usrId + min + seg;
        
        let nomServidor = user.usrNome;

        await connection('usuarios').where('usrEmail', emailUsuario)  
        .update({
           usrCodSeguranca: codSeguranca,           
        });

        let admEmail = process.env.EMAIL_USER;
        let hostEmail = process.env.EMAIL_HOST;
        let portEmail =  process.env.EMAIL_PORT;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false,
            },
        });

        const mailSent = await transporter.sendMail({
            text: `Código de Recuperação de senha: ${codSeguranca}`,
            subject: "E-mail de recuperação de senha",
            from: process.env.EMAIL_FROM,
            to: emailUsuario,
            html: `
            <html>
            <body>
                <center><h1>Olá ${nomServidor},<h1></center>
                <center><p>Você solicitou um código de segurança para recuperação de senha de acesso ao PORTAL DE ESPORTES</p></center></b></b>
                <center><p>Utilize o código de segurança abaixo para validar alteração da senha</p></center></b></b>
                <center><h3>Código de Segurança: ${codSeguranca}</h3></center></b></b></b>
                <center><img src="public/logo-barra.png" alt="Prefeitura de Aparecida de Goiânia" align="center" width="300px" height="120" /></center>
            </body>
          </html> 
            `,
        });
        console.log(mailSent);
        return response.status(200).send();  
    },    

    async updUsuario(request, response) {
        let id = request.params.idUsr;         
        const { usrNome, usrNascimento, usrCpf, usrCelular, usrEmail, usrNivAcesso} = request.body;
 
        await connection('usuarios').where('usrId', id)   
        .update({
            usrNome, 
            usrNascimento, 
            usrCpf, 
            usrCelular, 
            usrEmail, 
            usrNivAcesso        
        });
           
        return response.status(204).send();
    },

    async updAdmPassword(request, response) {
      
        const { email, password, codSeguranca } = request.body;

        let senha = crypto.createHash('md5').update(password).digest('hex');
        let segLimpa = '';
        await connection('usuarios')
        .where('usrEmail', email) 
        .where('usrCodSeguranca', codSeguranca)   
        .update({
            usrPassword: senha,
            usrCodSeguranca: segLimpa,           
        });
           
        return response.status(204).send();
    },

};

