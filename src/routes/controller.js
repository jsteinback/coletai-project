const pool = require('../../database');
const queries = require('./queries');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const paginaInicial = (req, res) => {
    res.render('index.html');
};

const getHome = (req, res) => {
    const idUsuario = req.params.id;
    res.render('home.html', { idUsuario: idUsuario });
};

const getLogin = (req, res) => {
    res.render('login.html');
};

const getAddUsuario = (req, res) => {
    res.render('cadastro-usuario.html');
};

const getEditUsuario = (req, res) => {
    res.render('edita-usuario.html');
};

const getTodosPontos = (req, res) => {
    res.render('todos-pontos.html');
};

const getAddPonto = (req, res) => {
    res.render('cadastro-ponto.html');
};

const getEditPonto = (req, res) => {
    res.render('edita-ponto.html');
};

const getViewPonto = (req, res) => {
    res.render('visualizar-ponto.html');
};

const getMeusPontos = (req, res) => {
    res.render('meus-pontos.html');
};

const getSobre = (req, res) => {
    res.render('sobre-coletai.html');
};

const addUsuario = async (req, res) => {
    const { email, senha, confirmaSenha, tipo, nome, telefone, cep, endereco, cidade, estado, documento, complemento } = req.body;

    //validações
    if (!nome) {
        return res.status(422).json({ msg: 'O nome é obrigatório!' })
    }

    if (!email) {
        return res.status(422).json({ msg: 'O e-mail é obrigatório!' })
    }

    if (!senha) {
        return res.status(422).json({ msg: 'A senha é obrigatória!' })
    }

    if (!confirmaSenha) {
        return res.status(422).json({ msg: 'Confirme a senha!' })
    }

    if (senha !== confirmaSenha) {
        return res.status(422).json({ msg: 'As senhas não conferem!' })
    }

    //valida se email já está cadastrado
    const { rows } = await pool.query(queries.checkUsuario, [email]);
    if (rows[0]) {
        return res.status(422).json({ message: 'E-mail já cadastrado!' })
    }

    // criar senha criptografada
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    //cria o usuário e faz o insert nas tabelas dependentes
    pool.query(queries.addUsuario, [email, senhaHash, tipo, nome, telefone, cep, endereco, cidade, estado], (error, results) => {
        if (error) throw error;
        const idUsuario = results.rows[0].id;
        const tipoUsuario = results.rows[0].tipo;
        if (tipoUsuario === 'PF') {
            pool.query(queries.addUsuarioPF, [documento, complemento, idUsuario]), (error, results) => {
                if (error) throw error;
            }
        } else if (tipoUsuario === 'PJ') {
            pool.query(queries.addUsuarioPJ, [documento, complemento, idUsuario]), (error, results) => {
                if (error) throw error;
            }
        }

        //gerar o token
        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: idUsuario,
            }, secret,
        )

        res.status(200).json({ message: 'Usuário cadastrado com sucesso!', token, redirectUrl: '/api/home/' + idUsuario });
    });
};

const login = async (req, res) => {
    const { email, senha } = req.body

    //validações
    if (!email) {
        return res.status(422).json({ message: 'O e-mail é obrigatório' })
    }

    if (!senha) {
        return res.status(422).json({ message: 'A senha é obrigatória' })
    }

    try {
        //valida se email existe
        const { rows } = await pool.query(queries.checkUsuario, [email]);
        if (!rows[0]) {
            return res.status(404).json({ message: 'E-mail não cadastrado' })
        }

        const senhaValida = rows[0].senha;
        const idUsuario = rows[0].id;

        //verifica se senha está correta
        const checkSenha = await bcrypt.compare(senha, senhaValida);

        if (!checkSenha) {
            return res.status(401).json({ message: 'Senha inválida!' });
        }

        //gerar o token
        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: idUsuario,
            }, secret,
        )

        res.status(200).json({ message: 'Login bem sucedido', token, redirectUrl: '/api/home/' + token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }

};

const addPonto = async (req, res) => {
    const { nome, descricao, telefone, cep, endereco, cidade, estado, responsavel } = req.body;

    //busca o token e valida se está armazenad
    var token = localStorage.getItem('token');
    return res.status(200).json({ token });


    /*
    try {
        //decodifica o token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const idUsuario = decodedToken.id;
        const dtCadastro = new Date();

        pool.query(queries.addPonto, [nome, descricao, telefone, cep, endereco, cidade, estado, dtCadastro, idUsuario, responsavel], (error, results) => {
            if (error) throw error;
            return res.status(200).json({ message: 'Ponto de coleta cadastrado com sucesso!' });
        });
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
    */
};

module.exports = {
    paginaInicial,
    getHome,
    getLogin,
    getAddUsuario,
    getEditUsuario,
    getTodosPontos,
    getAddPonto,
    getEditPonto,
    getViewPonto,
    getMeusPontos,
    getSobre,
    addUsuario,
    addPonto,
    login
};