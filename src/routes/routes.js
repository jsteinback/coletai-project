const { Router } = require('express');
const controller = require('./controller');
const router = Router();
var jwt = require('jsonwebtoken');

//api de página
router.get('/pagina-inicial', controller.paginaInicial);
router.get('/home', controller.getHome);
router.get('/login', controller.getLogin);
router.get('/cadastrar-usuario', controller.getAddUsuario);
router.get('/meu-perfil', controller.getEditUsuario);
router.get('/pontos-de-coleta', controller.getTodosPontos);
router.get('/pontos-de-coleta-auth', controller.getTodosPontosAuth);
router.get('/cadastrar-ponto-de-coleta', controller.getAddPonto);
router.get('/meus-pontos-de-coleta', controller.getMeusPontos);
router.get('/sobre', controller.getSobre);
router.get('/ponto-de-coleta/:id', controller.getEditPonto);
router.get('/detalhes-ponto-de-coleta/:id', controller.getViewPonto);

//api de dados
router.get('/all/pontos-de-coleta', controller.todosPontos);
router.get('/all/pagina-inicial', controller.pontosPreview);
router.get('/all/pontos-de-coleta-auth', checkToken, controller.todosPontos);
router.get('/all/home', checkToken, controller.pontosPreview);
router.get('/edit/meu-perfil', checkToken, controller.getUsuario);
router.get('/my/pontos-de-coleta', checkToken, controller.meusPontos);
router.get('/edit/ponto-de-coleta/:id', checkToken, controller.getPonto);
router.get('/view/ponto-de-coleta/:id', checkToken, controller.getDetalhesPonto);

router.post('/cadastrar-usuario', controller.addUsuario);
router.post('/editar-usuario', controller.editUsuario);
router.post('/cadastrar-ponto-de-coleta', controller.addPonto);
router.post('/login', controller.login);
router.post('/editar-ponto-de-coleta', controller.editPonto);
router.post('/fav/ponto-de-coleta/:id', controller.favPonto);
router.post('/rate/ponto-de-coleta/:id', controller.ratePonto);

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