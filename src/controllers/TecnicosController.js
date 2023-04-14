const crypto = require('crypto');
const connection = require('../database/connection');
require('dotenv/config');

const jwt = require('jsonwebtoken');
const {v4:uuidv4} = require ('uuid') ; 

module.exports = {   
    async index (request, response) {
        const tecnicos = await connection('tecnicos')
        .orderBy('tecNome')
        .select('*');
    
        return response.json(tecnicos);
    },    
        
    async signIn(request, response) {
        let email = request.body.email;
        let senha = request.body.password;
        let encodedVal = crypto.createHash('md5').update(senha).digest('hex');
    
        const user = await connection('tecnicos')
            .where('tecEmail', email)
            .where('tecPassword', encodedVal)
            .select('tecId', 'tecNome', 'tecEmail')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        let refreshIdToken = uuidv4(); 
                
        let token = jwt.sign({ id: user.tecId, name: user.tecNome, email: user.tecEmail, nivel: '1' }, process.env.SECRET_JWT, {
            expiresIn: "1h" 
        });
        let refreshToken = jwt.sign({ id: user.tecId, name: user.tecNome, email: user.tecEmail, nivel: '1'  }, process.env.SECRET_JWT_REFRESH, {
            expiresIn: "2h" 
        });

        return response.json({user, token, refreshToken});

    },

    async create(request, response) {
        
        //console.log(request.body);
        
        const {nome, cpf, nascimento, email, celular , password} = request.body;
        var status = 'A'; 
        var senha = crypto.createHash('md5').update(password).digest('hex');
        const [tecId] = await connection('tecnicos').insert({
            tecNome: nome, 
            tecEmail: email, 
            tecPassword: senha,
            tecCelular: celular, 
            tecCpf: cpf, 
            tecNascimento: nascimento, 
            tecStatus: status
        });
           
        return response.json({tecId});
    },

    async cadastra(request, response) {
        const {nome, cpf, nascimento, email, celular , password} = request.body;
        var status = 'A'; 
        var senha = crypto.createHash('md5').update(password).digest('hex');
        const [tecId] = await connection('tecnicos').insert({
            tecNome: nome, 
            tecEmail: email, 
            tecPassword: senha,
            tecCelular: celular, 
            tecCpf: cpf, 
            tecNascimento: nascimento, 
            tecStatus: status
        });
           
        return response.json({tecId});
    },

    async dadTecnicos (request, response) {        
        let id = request.params.idTec;
        let status = 'A';
        const tecnico = await connection('tecnicos')
        .where('tecStatus', status)
        .where('tecId', id)
        .orderBy('tecNome')
        .select('tecnicos.*');

        return response.json(tecnico);
    },

    async updTecnico(request, response) {
        let id = request.params.idTec;        
        const {tecNome, tecNascimento, tecCpf, tecEmail, tecCelular} = request.body;

        await connection('tecnicos')
        .where('tecId', id)
        .update({
            tecNome, 
            tecNascimento, 
            tecCpf, 
            tecEmail, 
            tecCelular 
        });
           
        return response.status(204).send();
    },

    async solTecPassTec (request, response) {
        let emailUsuario = request.params.email;
        const user = await connection('tecnicos')
            .where('tecEmail', emailUsuario)
            .select('tecId', 'tecNome')
            .first();

        if (!user) {
            return response.status(400).json({ error: 'Não encontrou técnico com este email'});
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
        
        let nomServidor = user.tecNome;

        await connection('tecnicos').where('tecEmail', emailUsuario)  
        .update({
           tecCodSeguranca: codSeguranca,           
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
        //console.log(mailSent);
        return response.status(200).send();  
    },

    async updTecPassword(request, response) {
      
        const { email, password, codSeguranca } = request.body;
 
        let senha = crypto.createHash('md5').update(password).digest('hex');
        let segLimpa = '';
        await connection('tecnicos')
        .where('tecEmail', email) 
        .where('tecCodSeguranca', codSeguranca)   
        .update({
            tecSenha: senha,
            tecCodSeguranca: segLimpa,           
        });
           
        return response.status(204).send();
    },

    async updTecPassTec(request, response) {
      
        const { email, password, codSeguranca } = request.body;
 
        let senha = crypto.createHash('md5').update(password).digest('hex');
        let segLimpa = '';
        await connection('tecnicos')
        .where('tecEmail', email) 
        .where('tecCodSeguranca', codSeguranca)   
        .update({
            tecSenha: senha,
            tecCodSeguranca: segLimpa,           
        });
           
        return response.status(204).send();
    },

};
