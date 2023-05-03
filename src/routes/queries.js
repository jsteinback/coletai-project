const addUsuario = "INSERT INTO usuario (email, senha, tipo, nome, telefone, cep, endereco, cidade, estado) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id,tipo";
const addUsuarioPF = "INSERT INTO usuario_pf (cpf, dt_nascimento, id_usuario) VALUES ($1, $2, $3)";
const addUsuarioPJ = "INSERT INTO usuario_pj (cnpj, nome_responsavel, id_usuario) VALUES ($1, $2, $3)";
const addPonto = "INSERT INTO ponto_coleta (nome, descricao, telefone, cep, endereco, cidade, estado, dt_cadastro, id_usuario, responsavel) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
const checkUsuario = "SELECT email, senha, id FROM usuario WHERE email = $1";

module.exports = {
    addUsuario,
    addUsuarioPF,
    addUsuarioPJ,
    addPonto,
    checkUsuario
};

// TESTES
/*
const removeUsuario = "DELETE FROM usuario WHERE id = $1";
const alteraUsuario = "UPDATE usuario SET email=$2, senha=$3, tipo=$4, nome=$5, telefone=$6, cep=$7, endereco=$8, cidade=$9, estado=$10 WHERE id = $1"
*/