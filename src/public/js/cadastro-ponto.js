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

        fetch(url, options)
            .then(response => {
                if (response.status === 422) {
                    return response.json().then(data => {
                        const snackbarContainer = document.querySelector('#snackbar-container')
                        const snackbarData = {
                            message: data.message,
                            timeout: 2750
                        }
                        snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);
                    })
                } else {
                    return response.json();
                }
            })
            .then(data => {
                window.location.href = data.redirectUrl; //redireciona pra página do ponto de coleta
            })
            .catch(error => console.error(error));

    });

    //campo de pesquisa
    const searchField = document.getElementById('search-field');
    searchField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const searchText = event.target.value;
            if (searchText.trim().length != 0) {
                window.location.href = '/api/resultado-pesquisa-auth/' + searchText;
            }
        };
    });

};

script_pagina();