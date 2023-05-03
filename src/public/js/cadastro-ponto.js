var script_pagina = function () {

    var btnEnviar = document.getElementById('bt-cadastro-ponto');
    var inputNome = document.getElementById('nome-ponto');
    var inputDescricao = document.getElementById('descricao');
    var inputResponsavel = document.getElementById('responsavel-ponto');
    var inputTelefone = document.getElementById('telefone-ponto');
    var inputCep = document.getElementById('cep-ponto');
    var inputEndereco = document.getElementById('endereco-ponto');
    var inputCidade = document.getElementById('cidade-ponto');
    var inputEstado = document.getElementById('estado-ponto');

    btnEnviar.addEventListener('click', function () {
        const data = new Date();
        var ponto = {
                nome: inputNome.value,
                descricao: inputDescricao.value,
                telefone: inputTelefone.value,
                cep: inputCep.value,
                endereco: inputEndereco.value,
                cidade: inputCidade.value,
                estado: inputEstado.value,
                responsavel: inputResponsavel.value
            }

        const url = 'cadastrar-ponto';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ponto)
        };

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            })
            .catch(error => console.error(error));

    });

};

script_pagina();