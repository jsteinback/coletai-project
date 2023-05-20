const { Router } = require('express');
const controller = require('./controller');
const router = Router();
var jwt = require('jsonwebtoken');

//api de página
router.get('/pagina-inicial', controller.paginaInicial);
router.get('/login', controller.getLogin);
router.get('/cadastrar-usuario', controller.getAddUsuario);
router.get('/pontos-de-coleta', controller.getTodosPontos);
router.get('/sobre', controller.getSobre);
router.get('/detalhes-ponto-de-coleta/:id', controller.getViewPonto);
router.get('/resultado-pesquisa/:busca', controller.getPesquisa);
router.get('/home', controller.getHome); //checktoken ok
router.get('/meu-perfil', controller.getEditUsuario); //checktoken ok
router.get('/pontos-de-coleta-auth', controller.getTodosPontosAuth); //checktoken ok
router.get('/cadastrar-ponto-de-coleta', controller.getAddPonto); //checktoken ok
router.get('/ponto-de-coleta/:id', controller.getEditPonto); //checktoken ok
router.get('/meus-pontos-de-coleta', controller.getMeusPontos); //checktoken ok
router.get('/sobre-auth', controller.getSobreAuth);
router.get('/detalhes-ponto-de-coleta-auth/:id', controller.getViewPontoAuth); //checktoken ok
router.get('/resultado-pesquisa-auth/:busca', controller.getPesquisaAuth); //checktoken ok
router.get('/redefinir-senha', controller.getRedefinirSenha);

//api de dados
router.get('/all/pagina-inicial', controller.pontosPreview);
router.get('/all/pontos-de-coleta', controller.todosPontos);
router.get('/view/ponto-de-coleta/:id', controller.getDetalhesPonto);
router.get('/get/resultado-pesquisa/:busca', controller.getResultadoPesquisa);
//api de dados autenticados
router.get('/all/home', checkToken, controller.pontosPreview); //checktoken ok
router.get('/all/pontos-de-coleta-auth', checkToken, controller.todosPontos); //checktoken ok
router.get('/view-detalhes-ponto-de-coleta-auth/:id', checkToken, controller.getDetalhesPontoAuth); //checktoken ok
router.get('/get-resultado-pesquisa-auth/:busca', checkToken, controller.getResultadoPesquisaAuth); //checktoken ok
router.get('/edit/meu-perfil', checkToken, controller.getUsuario); //checktoken ok
router.get('/all/meus-pontos-de-coleta', checkToken, controller.meusPontos); //checktoken ok
router.get('/edit/ponto-de-coleta/:id', checkToken, controller.getPonto); //checktoken ok

//post
router.post('/login', controller.login);
router.post('/cadastrar-usuario', controller.addUsuario);
router.post('/editar-usuario', controller.editUsuario); //checktoken ok
router.post('/cadastrar-ponto-de-coleta', checkToken, controller.addPonto); //checktoken ok
router.post('/editar-ponto-de-coleta', controller.editPonto);
router.post('/rate-ponto-de-coleta/:id', checkToken, controller.ratePonto);
router.post('/fav-ponto-de-coleta/:id', checkToken, controller.favPonto);
router.post('/add-comentario/:id', checkToken, controller.addComentario);
router.post('/esqueci-senha', controller.esqueciSenha);
router.post('/redefinir-senha-post', controller.redefinirSenha);

//api de exclusão
router.delete('/excluir-ponto-de-coleta/:id', controller.deletePonto);

//checar token
function checkToken(req, res, next) {
    const token = req.headers['authorization']

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado!' })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const idUsuario = decodedToken.id;
        req.idUsuario = idUsuario
        next()
    } catch (error) {
        res.status(401).json({ message: 'Token inválido!' })
    }
};

module.exports = router;