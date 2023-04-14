const crypto = require('crypto');
const express = require('express');
const routes = express.Router();
const jwt = require('jsonwebtoken');

const UsersController = require('./controllers/UsersController');
const ModalidadesController = require('./controllers/ModalidadesController');
const EventosController = require('./controllers/EventosController');
const EquipesController = require('./controllers/EquipesController');
const TecnicosController = require('./controllers/TecnicosController');
const AtletasController = require('./controllers/AtletasController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Esportes!',
    });
});

function verifyJWT(req, res, next){
    //console.log('verificando token...')
    const token = req.headers["x-access-token"];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET_JWT, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Token invalid!' });
        }                
        next();            
    });
}

async function verifyRefreshJWT(req, res, next){
    //console.log('verificando refresh token...')
    const refreshTokenJWT = req.headers["x-access-token"];
    if (!refreshTokenJWT) return res.status(401).send({ auth: false, message: 'No refresh token provided.' });
    
    jwt.verify(refreshTokenJWT, process.env.SECRET_JWT_REFRESH, (err, userInfo) => {
        if (err) {
           return res.status(403).send({ auth: false, message: 'Refresh Token invalid!' });
        }
        next();            
    });
}

routes.post('/refreshToken', verifyRefreshJWT, UsersController.refreshToken);

routes.post('/signIn', UsersController.signIn);
routes.post('/loginTec', TecnicosController.signIn);

routes.get('/users', verifyJWT, UsersController.index);
routes.post('/newuser', verifyJWT, UsersController.create);

routes.put('/solPassword/:email', UsersController.solPassword);
routes.put('/updAdmPassword', UsersController.updAdmPassword);
routes.put('/solPassTec/:email', TecnicosController.solTecPassTec);
routes.put('/updTecPassTec', TecnicosController.updTecPassTec);

routes.get('/loginAdm/:email/:password/:modId', UsersController.loginAdm);

routes.get('/dadUsuario/:idUsr', verifyJWT, UsersController.dadUsuario);
routes.put('/updUsuario/:idUsr', verifyJWT, UsersController.updUsuario);
routes.post('/newModUsuario', verifyJWT, UsersController.newModUsuario);

routes.get('/modalJWT', verifyJWT, ModalidadesController.index);
routes.get('/modUsuario/:idUsr', verifyJWT, ModalidadesController.modUsuario);
routes.post('/newmodalidade', verifyJWT, ModalidadesController.create);
routes.get('/dadModalidade/:modId', verifyJWT, ModalidadesController.dadModalidade);
routes.put('/updModalidade/:modId', verifyJWT, ModalidadesController.updModalidade);

routes.get('/eventos', verifyJWT, EventosController.index);
routes.post('/newevento', verifyJWT, EventosController.create);
routes.get('/eveModal/:idMod', verifyJWT, EventosController.eveModal);
routes.get('/dadEvento/:idEve', verifyJWT, EventosController.dadEvento);
routes.put('/updEvento/:idEve', verifyJWT, EventosController.updEvento);

routes.get('/equipes', verifyJWT, EquipesController.index);
routes.post('/newequipe', verifyJWT, EquipesController.create);
routes.get('/equEvento/:idEve', verifyJWT, EquipesController.equEvento);
routes.get('/dadEquipe/:idEqu', verifyJWT, EquipesController.dadEquipe);
routes.put('/updEquipe/:idEqu', verifyJWT, EquipesController.updEquipe);
routes.get('/admEquipes/:idEve', verifyJWT, EquipesController.admEquipes);

routes.get('/tecnicos', verifyJWT, TecnicosController.index);

routes.post('/cadtecnico', TecnicosController.cadastra);

routes.post('/newtecnico', verifyJWT, TecnicosController.create);
routes.put('/updTecnico/:idTec', verifyJWT, TecnicosController.updTecnico);
routes.get('/dadTecnico/:idTec', verifyJWT, TecnicosController.dadTecnicos);
routes.post('/updTecPassword', verifyJWT, TecnicosController.updTecPassword);

routes.get('/atlEquipe/:idEqu', verifyJWT, AtletasController.atlEquipe);
routes.post('/newatleta', verifyJWT, AtletasController.create);
routes.get('/busAtleta/:atlId', verifyJWT, AtletasController.busAtleta);
routes.put('/updAtleta/:atlId', verifyJWT, AtletasController.updAtleta);
routes.get('/dadAtleta/:atlId', verifyJWT, AtletasController.dadAtleta);

module.exports = routes;
