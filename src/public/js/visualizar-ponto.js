var script_pagina = function () {
    const botoesEstrela = document.querySelectorAll('.icon-classificacao');

    //Busca os dados do ponto de coleta
    var idPonto = window.location.pathname.match(/\/(\d+)$/)[1];
    const url = '/api/view/ponto-de-coleta/' + idPonto;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(url, options)
        .then(response => {
            return response.json();
        })
        .then(data => {
            //formatar os campos
            const cep = data.cep;
            const cepFormatado = cep.substring(0, 5) + "-" + cep.substring(5);
            const telefone = data.telefone;
            var telFormatado = 0;

            if (telefone.length === 11) {
                telFormatado = "(" + telefone.substring(0, 2) + ") " + telefone.substring(2, 7) + "-" + telefone.substring(7)
            } else {
                telFormatado = "(" + telefone.substring(0, 2) + ") " + telefone.substring(2, 6) + "-" + telefone.substring(6)
            };

            //apresentar na tela
            const nomePonto = document.getElementById('nome');
            nomePonto.textContent = data.nome;
            document.getElementById('descricao').value = data.descricao;
            document.getElementById('responsavel').value = data.responsavel;
            document.getElementById('telefone').value = telFormatado;
            document.getElementById('cep').value = cepFormatado;
            document.getElementById('endereco').value = data.endereco;
            document.getElementById('cidade').value = data.cidade;
            document.getElementById('estado').value = data.estado;

            //atualiza cor das estrelas
            botoesEstrela.forEach((botao, index) => {
                if (index < data.classificacao) {
                    botao.classList.remove('icon-desabilitado');
                    botao.classList.add('classificado');
                } else {
                    botao.classList.remove('classificado');
                    botao.classList.add('icon-desabilitado');
                }
            })
            console.log(data);
        }).catch(error => console.error(error));

    //Botão google maps
    document.getElementById('btn-localizacao').addEventListener('click', () => {
        const endereco = document.getElementById('endereco').value;
        const cidade = document.getElementById('cidade').value;
        const estado = document.getElementById('estado').value;
        const cep = document.getElementById('cep').value;
        const enderecoCompleto = `${endereco}, ${cidade}, ${estado}, ${cep}`;
        const urlLocal = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;
        //console.log(urlLocal);
        window.open(urlLocal, '_blank');
    });

    //campo de pesquisa
    const searchField = document.getElementById('search-field');
    searchField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const searchText = event.target.value;
            if (searchText.trim().length != 0) {
                window.location.href = '/api/resultado-pesquisa/' + searchText;
            }
        };
    });

} //fecha function

script_pagina();