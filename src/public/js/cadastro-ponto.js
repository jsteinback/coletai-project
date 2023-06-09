var script_pagina = function () {
    const token = localStorage.getItem('token');

    var btnEnviar = document.getElementById('bt-cadastro-ponto');
    var inputNome = document.getElementById('nome');
    var inputDescricao = document.getElementById('descricao');
    var inputResponsavel = document.getElementById('responsavel');
    var inputTelefone = document.getElementById('telefone');
    var inputCep = document.getElementById('cep');
    var inputEndereco = document.getElementById('endereco');
    var inputCidade = document.getElementById('cidade');
    var inputEstado = document.getElementById('estado');

    btnEnviar.addEventListener('click', function () {
        var ponto = {};
        ponto = {
            nome: inputNome.value,
            descricao: inputDescricao.value,
            telefone: inputTelefone.value,
            cep: inputCep.value,
            endereco: inputEndereco.value,
            cidade: inputCidade.value,
            estado: inputEstado.value,
            responsavel: inputResponsavel.value
        }

        const url = 'cadastrar-ponto-de-coleta';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify(ponto)
        };

        requisicao(url, options)
            .then(data => {
                if (data.status === 422) {
                    const snackbarContainer = document.querySelector('#snackbar-container')
                    const snackbarData = {
                        message: data.message,
                        timeout: 2750
                    }
                    snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);
                } else {
                    const snackbarContainer = document.querySelector('#snackbar-container-success')
                    const snackbarData = {
                        message: data.message,
                        timeout: 2000
                    }
                    snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);

                    setTimeout(() => {
                        window.location.href = data.redirectUrl; // Redireciona para a página do ponto de coleta
                    }, 2500);
                }
            })

    });

    //campo de pesquisa
    const searchField = document.getElementById('search-field');
    searchField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const searchText = event.target.value;
            if (searchText.trim().length != 0) {
                window.location.href = '/resultado-pesquisa-auth/' + searchText;
            }
        };
    });

};

script_pagina();