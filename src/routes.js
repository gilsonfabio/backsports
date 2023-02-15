const express = require('express');
const routes = express.Router();

const UsersController = require('./controllers/UsersController');
const ModalidadesController = require('./controllers/ModalidadesController');
const EventosController = require('./controllers/EventosController');
const TecnicosController = require('./controllers/TecnicosController');
const EquipesController = require('./controllers/EquipesController');
const AtletasController = require('./controllers/AtletasController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Esportes!',
    });
});

routes.get('/users', UsersController.index);
routes.get('/signIn/:email/:password', UsersController.signIn);
routes.post('/newuser', UsersController.create);
routes.put('/solPassword/:email', UsersController.solPassword);
routes.post('/updAdmPassword', UsersController.updAdmPassword);
routes.get('/dadUsuario/:idUsr', UsersController.dadUsuario);
routes.get('/modUsuario/:idUsr', UsersController.modUsuario);
routes.put('/updUsuario/:idUsr', UsersController.updUsuario);
routes.post('/newModUsuario', UsersController.newModUsuario);
routes.get('/loginAdm/:email/:password/:modId', UsersController.loginAdm);

routes.get('/tecnicos', TecnicosController.index);
routes.get('/loginTec/:email/:password', TecnicosController.signIn);
routes.post('/newtecnico', TecnicosController.create);
routes.put('/updTecnico/:idTec', TecnicosController.updTecnico);
routes.get('/dadTecnico/:idTec', TecnicosController.dadTecnicos);
routes.put('/solTecPassword/:email', TecnicosController.solTecPassword);
routes.post('/updTecPassword', TecnicosController.updTecPassword);

routes.get('/modalidades', ModalidadesController.index);
routes.get('/dadModalidade/:modId', ModalidadesController.dadModalidade);
routes.post('/newmodalidade', ModalidadesController.create);
routes.put('/updModalidade/:modId', ModalidadesController.updModalidade);

routes.get('/eventos', EventosController.index);
routes.post('/newevento', EventosController.create);
routes.get('/eveModal/:idMod', EventosController.eveModal);
routes.get('/dadEvento/:idEve', EventosController.dadEvento);
routes.put('/updEvento/:idEve', EventosController.updEvento);

routes.get('/equipes', EquipesController.index);
routes.post('/newequipe', EquipesController.create);
routes.get('/equEvento/:idEve', EquipesController.equEvento);
routes.get('/dadEquipe/:idEqu', EquipesController.dadEquipe);
routes.put('/updEquipe/:idEqu', EquipesController.updEquipe);
routes.get('/admEquipes/:idEve', EquipesController.admEquipes);

routes.get('/atlEquipe/:idEqu', AtletasController.atlEquipe);
routes.post('/newatleta', AtletasController.create);
routes.get('/busAtleta/:atlId', AtletasController.busAtleta);
routes.put('/updAtleta/:atlId', AtletasController.updAtleta);
routes.get('/dadAtleta/:atlId', AtletasController.dadAtleta);

module.exports = routes;
