const pool = require('../../database');
const queries = require('./queries');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const paginaInicial = (req, res) => {
    res.render('index.html');
};

const getHome = (req, res) => {
    res.render('home.html');
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

const getTodosPontosAuth = (req, res) => {
    res.render('todos-pontos-autenticado.html');
};

const getAddPonto = (req, res) => {
    res.render('cadastro-ponto.html');
};

const getEditPonto = (req, res) => {
    res.render('edita-ponto.html');
};

const getViewPonto = (req, res) => {
    res.render('visualizar-ponto-autenticado.html');
};

const getMeusPontos = (req, res) => {
    res.render('meus-pontos.html');
};

const getSobre = (req, res) => {
    res.render('sobre-coletai.html');
};

const addUsuario = async (req, res) => {
    const { email, senha, confirmaSenha, tipo, nome, telefone, cep, endereco, cidade, estado, documento, complemento } = req.body;

    if (!nome) {
        return res.status(422).json({ message: 'O nome é obrigatório!' })
    }

    if (!email) {
        return res.status(422).json({ message: 'O e-mail é obrigatório!' })
    }

    if (!senha) {
        return res.status(422).json({ message: 'A senha é obrigatória!' })
    }

    if (!confirmaSenha) {
        return res.status(422).json({ message: 'Confirme a senha!' })
    }

    if (senha !== confirmaSenha) {
        return res.status(422).json({ message: 'As senhas não conferem!' })
    }

    const { rows } = await pool.query(queries.checkUsuario, [email]);
    if (rows[0]) {
        return res.status(422).json({ message: 'E-mail já cadastrado!' })
    }

    // criar senha criptografada
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    try {
        //cria o usuário e faz o insert nas tabelas dependentes
        pool.query(queries.addUsuario, [email, senhaHash, tipo, nome, telefone, cep, endereco, cidade, estado], (error, results) => {
            if (error) throw error;
            const idUsuario = results.rows[0].id;
            const tipoUsuario = results.rows[0].tipo;
            if (tipoUsuario === 'PF') {
                pool.query(queries.addUsuarioPF, [documento, complemento, idUsuario]);
            } else if (tipoUsuario === 'PJ') {
                pool.query(queries.addUsuarioPJ, [documento, complemento, idUsuario]);
            }
        });

        res.status(200).json({ message: 'Usuário cadastrado com sucesso!', redirectUrl: '/api/login/' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }
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
            }, secret
        )

        res.status(200).json({ message: 'Login bem sucedido', token, redirectUrl: '/api/home' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }

};

const addPonto = async (req, res) => {
    const { nome, descricao, telefone, cep, endereco, cidade, estado, responsavel } = req.body;

    if (!nome || !descricao || !telefone || !cep || !endereco || !cidade || !estado || !responsavel) {
        return res.status(422).json({ message: 'Favor preencher todos os campos!' })
    }

    try {
        const dt_cadastro = new Date();

        //validar usuário conectado
        const token = req.headers['authorization'];
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const idUsuario = decodedToken.id;

        //cadastrar ponto de coleta
        pool.query(queries.addPonto, [nome, descricao, telefone, cep, endereco, cidade, estado, dt_cadastro, idUsuario, responsavel], (error, results) => {
            if (error) throw error;

            const idPonto = results.rows[0].id;
            const url = '/api/detalhes-ponto-de-coleta/' + idPonto
            res.status(200).json({ message: 'Ponto de Coleta cadastrado com sucesso!', redirectUrl: url });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }

};

const getUsuario = async (req, res) => {
    pool.query(queries.getUsuarioById, [req.idUsuario], (error, results) => {
        if (error) throw error;
        return res.status(200).json(results.rows[0]);
    });
}

const editUsuario = async (req, res) => {
    const { id, nome, complemento, telefone, cep, endereco, cidade, estado, senhaDigitada, tipo } = req.body;

    if (!senhaDigitada) {
        return res.status(422).json({ message: 'A senha é obrigatória' })
    }

    try {

        //busca senha válida no banco de dados
        const { rows } = await pool.query(queries.getUsuarioById, [id]);
        const senhaValida = rows[0].senha;
        const checkSenha = await bcrypt.compare(senhaDigitada, senhaValida);

        if (!checkSenha) {
            return res.status(401).json({ message: 'Senha inválida!' });
        }

        //atualiza dados
        pool.query(queries.updateUsuario, [id, nome, telefone, cep, endereco, cidade, estado], (error, results) => {
            if (tipo === 'PF') {
                pool.query(queries.updateUsuarioPF, [id, complemento]);
            } else if (tipo === 'PJ') {
                pool.query(queries.updateUsuarioPJ, [id, complemento]);
            }
        });

        res.status(200).json({ message: 'Perfil alterado com sucesso!' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }
}

const meusPontos = async (req, res) => {
    try {
        pool.query(queries.getMeusPontos, [req.idUsuario], (error, results) => {
            return res.status(200).json(results.rows);
        })
    } catch (error) {
        throw error;
    }
}

const todosPontos = async (req, res) => {
    try {
        pool.query(queries.getTodosPontos, (error, results) => {
            return res.status(200).json(results.rows);
        })
    } catch (error) {
        throw error;
    }
}

const pontosPreview = async (req, res) => {
    try {
        pool.query(queries.pontosPreview, (error, results) => {
            return res.status(200).json(results.rows);
        })
    } catch (error) {
        throw error;
    }
}

const getPonto = async (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getPontoById, [id], (error, results) => {
        if (error) throw error;
        return res.status(200).json(results.rows[0]);
    });
}

const editPonto = async (req, res) => {
    const { id, nome, descricao, responsavel, telefone, cep, endereco, cidade, estado } = req.body;

    try {
        pool.query(queries.updatePonto, [id, nome, descricao, responsavel, telefone, cep, endereco, cidade, estado], (error, results) => {
            return res.status(200).json({ message: 'Ponto alterado com sucesso!' });
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }

}

const deletePonto = async (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.deletePonto, [id], (error, results) => {
        if (error) throw error;
        return res.status(200).json({ message: 'Ponto de Coleta excluído com sucesso!', redirectUrl: '/api/meus-pontos-de-coleta' });
    });
}

const getDetalhesPonto = async (req, res) => {
    const id = parseInt(req.params.id);

    // validar usuário conectado
    const token = req.headers["authorization"];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const idUsuario = decodedToken.id;

    try {
        // busca os dados do ponto de coleta
        const results = await pool.query(queries.getPontoById, [id]);

        // busca a classificação
        const checkClassificacao = await pool.query(queries.checkClassificacao, [idUsuario,id]);

        if (checkClassificacao.rows[0]) {
            // tem classificação, manda no results
            const classificacao = checkClassificacao.rows[0].avaliacao;
            return res.status(200).json({ ...results.rows[0], classificacao });
        } else {
            // não tem classificação
            return res.status(200).json(results.rows[0]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao consultar o banco de dados" });
    }
};


const favPonto = async (req, res) => {
    //validar usuário conectado
    const token = req.headers['authorization'];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const idUsuario = decodedToken.id;

    const idPonto = parseInt(req.params.id);

    try {
        const favorito = 1;
        const dt_habilitado = new Date();
        pool.query(queries.favPonto, [idUsuario, idPonto, favorito, dt_habilitado], (error, results) => {
            return res.status(200).json({ message: 'Ponto de Coleta favoritado' });
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }

}

const ratePonto = async (req, res) => {
    const { classificacao } = req.body;
    const idPonto = parseInt(req.params.id);

    //validar usuário conectado
    const token = req.headers['authorization'];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const idUsuario = decodedToken.id;

    try {
        //valida se usuário já classificou
        const { rows } = await pool.query(queries.checkClassificacao, [idUsuario, idPonto]);
        if (rows[0]) {
            //já classificou, apenas faz o update
            pool.query(queries.updateClassificacao, [idUsuario, idPonto, classificacao], (error, results) => {
                return res.status(200).json({ message: 'Classificação atualizada!' })
            })
        } else {
            //não classificou, então faz o insert
            pool.query(queries.insertClassificacao, [idUsuario, idPonto, classificacao], (error, results) => {
                return res.status(200).json({ message: 'Classificação inserida!' });
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
    }
}

module.exports = {
    paginaInicial,
    getHome,
    getLogin,
    getAddUsuario,
    getEditUsuario,
    getTodosPontos,
    getTodosPontosAuth,
    getAddPonto,
    getEditPonto,
    getViewPonto,
    getMeusPontos,
    getSobre,
    addUsuario,
    addPonto,
    login,
    getUsuario,
    editUsuario,
    meusPontos,
    todosPontos,
    getPonto,
    editPonto,
    deletePonto,
    pontosPreview,
    getDetalhesPonto,
    favPonto,
    ratePonto
};