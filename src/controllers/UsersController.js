const crypto = require('crypto');
const connection = require('../database/connection');

const nodemailer = require("nodemailer");

module.exports = {   
    async index (request, response) {
        const users = await connection('usuarios')
        .orderBy('usrNome')
        .select('*');
    
        return response.json(users);
    },    
        
    async signIn(request, response) {
        let email = request.params.email;
        let senha = request.params.password;

        //console.log(email);
        //console.log(senha);

        var encodedVal = crypto.createHash('md5').update(senha).digest('hex');
        const user = await connection('usuarios')
            .where('usrEmail', email)
            .where('usrPassword', encodedVal)
            .select('usrId', 'usrNome')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        return response.json(user);
    },
    
    async create(request, response) {
        //console.log(request.body);
        const {nome, cpf, nascimento, email, celular , password} = request.body;
        var status = 'A'; 
        var senha = crypto.createHash('md5').update(password).digest('hex');
        const [usrId] = await connection('usuarios').insert({
            usrNome: nome, 
            usrEmail: email, 
            usrPassword: senha,
            usrCelular: celular, 
            usrCpf: cpf, 
            usrNascimento: nascimento, 
            usrStatus: status
        });
           
        return response.json({usrId});
    },

    async solPassword (request, response) {
        let emailUsuario = request.params.email;

        //console.log('email solicitado:', emailUsuario)

        const user = await connection('usuarios')
            .where('usrEmail', emailUsuario)
            .select('usrId', 'usrNome')
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

    async updPassword(request, response) {
        let id = request.params.idUsr;         
        const { password } = request.body;
 
        var senha = crypto.createHash('md5').update(password).digest('hex');
        await connection('usuarios').where('usrId', id)   
        .update({
            usrSenha: senha,           
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
            usrSenha: senha,
            usrCodSeguranca: segLimpa,           
        });
           
        return response.status(204).send();
    },
    
};

