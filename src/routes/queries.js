const addUsuario = "INSERT INTO usuario (email, senha, tipo, nome, telefone, cep, endereco, cidade, estado) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id,tipo";
const addUsuarioPF = "INSERT INTO usuario_pf (cpf, dt_nascimento, id_usuario) VALUES ($1, $2, $3)";
const addUsuarioPJ = "INSERT INTO usuario_pj (cnpj, nome_responsavel, id_usuario) VALUES ($1, $2, $3)";
const addPonto = "INSERT INTO ponto_coleta (nome, descricao, telefone, cep, endereco, cidade, estado, dt_cadastro, id_usuario, responsavel) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id";
const checkUsuario = "SELECT email, senha, id FROM usuario WHERE email = $1";
const getUsuarioById = "SELECT us.tipo tipo, us.id id,us.email email,us.nome nome,us.telefone telefone,us.cep cep,us.endereco endereco,us.cidade cidade,us.estado estado, CASE WHEN us.tipo = 'PF' THEN pf.cpf WHEN us.tipo = 'PJ' THEN pj.cnpj END AS documento, CASE WHEN us.tipo = 'PF' THEN CAST(pf.dt_nascimento AS VARCHAR) WHEN us.tipo = 'PJ' THEN pj.nome_responsavel END AS complemento, us.senha senha FROM usuario us LEFT JOIN usuario_pf pf ON us.id = pf.id_usuario LEFT JOIN usuario_pj pj ON us.id = pj.id_usuario WHERE us.id = $1"
const updateUsuario = "UPDATE usuario SET nome = $2, telefone = $3, cep = $4, endereco = $5, cidade = $6, estado = $7 WHERE id = $1";
const updateUsuarioPF = "UPDATE usuario_pf SET dt_nascimento = $2 WHERE id = $1";
const updateUsuarioPJ = "UPDATE usuario_pj SET nome_responsavel = $2 WHERE id = $1";
const getMeusPontos = "SELECT id, nome, descricao FROM ponto_coleta WHERE id_usuario = $1 ORDER BY dt_cadastro DESC";
const getTodosPontos = "SELECT id, nome, descricao FROM ponto_coleta ORDER BY dt_cadastro DESC";
const getPontoById = "SELECT * FROM ponto_coleta WHERE id = $1";
const getPontoByIdUser = "SELECT * FROM ponto_coleta WHERE id = $1 AND id_usuario=$2";
const updatePonto = "UPDATE ponto_coleta SET nome = $2, descricao = $3, responsavel = $4, telefone = $5, cep = $6, endereco = $7, cidade = $8, estado = $9 WHERE id = $1";
const deletePonto = "DELETE FROM ponto_coleta WHERE id = $1";
const pontosPreview = "SELECT id, nome, descricao FROM ponto_coleta ORDER BY dt_cadastro DESC LIMIT 4";
const checkClassificacao = "SELECT * FROM ponto_coleta_avaliacao WHERE id_usuario = $1 AND id_ponto = $2";
const insertClassificacao = "INSERT INTO ponto_coleta_avaliacao(id_usuario, id_ponto, avaliacao) VALUES ($1, $2, $3)";
const updateClassificacao = "UPDATE ponto_coleta_avaliacao SET avaliacao = $3 WHERE id_usuario = $1 AND id_ponto = $2";
const checkClassificacaoGeral = "SELECT id_ponto, ROUND(AVG(avaliacao)) classificacao FROM ponto_coleta_avaliacao WHERE id_ponto = $1 GROUP BY id_ponto";
const getResultadoPesquisa = "SELECT id, nome, descricao FROM ponto_coleta WHERE (LOWER(nome) like CONCAT('%', LOWER($1), '%') OR LOWER(descricao) like CONCAT('%', LOWER($1), '%') OR LOWER(endereco) like CONCAT('%', LOWER($1), '%') OR LOWER(cidade) like CONCAT('%', LOWER($1), '%'));";
const insertFavorito = "INSERT INTO usuario_favorito(id_usuario, id_ponto, favorito, dt_habilitado) VALUES ($1, $2, $3, $4)";
const updateFavorito = "UPDATE usuario_favorito	SET favorito = $3, dt_desabilitado = $4 WHERE id_usuario = $1 AND id_ponto = $2";
const reUpdateFavorito = "UPDATE usuario_favorito SET favorito = $3, dt_habilitado = $4 WHERE id_usuario = $1 AND id_ponto = $2";
const checkFavorito = "SELECT favorito FROM usuario_favorito WHERE id_usuario = $1 AND id_ponto = $2";
const insertComentario = "INSERT INTO ponto_coleta_comentario (dt_comentario, comentario, id_usuario, id_ponto) VALUES ($4, $3, $1, $2)";
const getComentario = "SELECT c.id_ponto, c.id_usuario, u.nome, c.dt_comentario, c.comentario FROM ponto_coleta_comentario c INNER JOIN usuario u ON c.id_usuario = u.id WHERE id_ponto = $1 ORDER BY dt_comentario DESC";
const redefinirSenha = "UPDATE usuario SET senha = $2 WHERE email = $1";

module.exports = {
    addUsuario,
    addUsuarioPF,
    addUsuarioPJ,
    addPonto,
    checkUsuario,
    getUsuarioById,
    updateUsuario,
    updateUsuarioPF,
    updateUsuarioPJ,
    getMeusPontos,
    getTodosPontos,
    getPontoById,
    getPontoByIdUser,
    updatePonto,
    deletePonto,
    pontosPreview,
    checkClassificacao,
    insertClassificacao,
    updateClassificacao,
    checkClassificacaoGeral,
    getResultadoPesquisa,
    insertFavorito,
    updateFavorito,
    checkFavorito,
    reUpdateFavorito,
    insertComentario,
    getComentario,
    redefinirSenha
};