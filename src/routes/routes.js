const { Router } = require('express');
const controller = require('./controller');
const router = Router();
var jwt = require('jsonwebtoken');

router.get('/pagina-inicial', controller.paginaInicial);
router.get('/home/:id', checkToken, controller.getHome);
router.get('/login', controller.getLogin);
router.get('/cadastrar-usuario', controller.getAddUsuario);
router.get('/editar-usuario/:id', controller.getEditUsuario);
router.get('/pontos-de-coleta', controller.getTodosPontos);
router.get('/cadastrar-ponto-de-coleta/:id', controller.getAddPonto);
router.get('/editar-ponto-de-coleta', controller.getEditPonto);
router.get('/detalhes-ponto-de-coleta', controller.getViewPonto);
router.get('/meus-pontos-de-coleta', controller.getMeusPontos);
router.get('/sobre', controller.getSobre);

router.post('/cadastrar-usuario', controller.addUsuario);
router.post('/cadastrar-ponto-de-coleta/:id', controller.addPonto);
router.post('/login', controller.login);

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado!' })
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    } catch (error) {
        res.status(400).json({ message: 'Token inválido!' })
    }
}

module.exports = router;