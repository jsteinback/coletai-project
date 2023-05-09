var script_pagina = function () {

    const token = localStorage.getItem('token');

    document.getElementById('btn-sair').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/api/pagina-inicial';
    });

    //Busca os dados do ponto de coleta
    var idPonto = window.location.pathname.match(/\/(\d+)$/)[1];
    const url = '/api/edit/ponto-de-coleta/' + idPonto;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        }
    };

    requisicao(url, options)
        .then(data => {
            idPonto = data.id;
            document.getElementById('nome').value = data.nome;
            document.getElementById('descricao').value = data.descricao;
            document.getElementById('responsavel').value = data.responsavel;
            document.getElementById('telefone').value = data.telefone;
            document.getElementById('cep').value = data.cep;
            document.getElementById('endereco').value = data.endereco;
            document.getElementById('cidade').value = data.cidade;
            document.getElementById('estado').value = data.estado;
        })

    //Atualizar os dados do ponto de coleta
    var btnEnviar = document.getElementById('bt-salvar-ponto');
    btnEnviar.addEventListener('click', function () {
        var ponto = {};
        ponto = {
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
            responsavel: document.getElementById('responsavel').value,
            telefone: document.getElementById('telefone').value,
            cep: document.getElementById('cep').value,
            endereco: document.getElementById('endereco').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            id: idPonto
        }

        const url = '/api/editar-ponto-de-coleta';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ponto)
        };

        fetch(url, options)
            .then(response => {
                if (response.status === 422 || response.status === 401) {
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
                const snackbarContainer = document.querySelector('#snackbar-container-success')
                const snackbarData = {
                    message: data.message,
                    timeout: 2750
                }
                snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);
            })
            .catch(error => console.error(error));
    })

    //Excluir ponto de coleta
    var btnEnviar = document.getElementById('bt-excluir-ponto');
    btnEnviar.addEventListener('click', function () {

        var dialog = document.querySelector('dialog');
        dialog.showModal();

        //Confirma exclusão
        dialog.querySelector('.confirm').addEventListener('click', function () {
            dialog.close();

            const url = '/api/excluir-ponto-de-coleta/' + idPonto;
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            fetch(url, options)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    window.location.href = data.redirectUrl;
                })
                .catch(error => console.error(error));
        });

        //Cancela exclusão
        dialog.querySelector('.close').addEventListener('click', function () {
            dialog.close();
        });
    });

} //fecha function

script_pagina();