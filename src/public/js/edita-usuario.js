var script_pagina = function () {

    const token = localStorage.getItem('token');

    document.getElementById('btn-sair').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/api/pagina-inicial';
    });

    //Busca os dados do usuário
    var tipo = 0;
    var idUsuario = 0;
    const url = 'edit/meu-perfil';
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        }
    };

    requisicao(url, options)
        .then(data => {
            tipo = data.tipo;
            idUsuario = data.id;

            if (tipo === 'PF') {
                document.getElementById('nome-pj').style.display = "none";
                document.getElementById('doc-pj').style.display = "none";
                document.getElementById('comp-pj').style.display = "none";
                document.getElementById('nome-completo').value = data.nome;
                document.getElementById('cpf').value = data.documento;
                document.getElementById('data-nascimento').value = data.complemento;
                document.getElementById('telefone').value = data.telefone;
                document.getElementById('cep').value = data.cep;
                document.getElementById('endereco').value = data.endereco;
                document.getElementById('cidade').value = data.cidade;
                document.getElementById('estado').value = data.estado;
                document.getElementById('email').value = data.email;
            } else if (tipo === 'PJ') {
                document.getElementById('nome-pf').style.display = "none";
                document.getElementById('doc-pf').style.display = "none";
                document.getElementById('comp-pf').style.display = "none";
                document.getElementById('razao-social').value = data.nome;
                document.getElementById('cnpj').value = data.documento;
                document.getElementById('nome-responsavel').value = data.complemento;
                document.getElementById('telefone').value = data.telefone;
                document.getElementById('cep').value = data.cep;
                document.getElementById('endereco').value = data.endereco;
                document.getElementById('cidade').value = data.cidade;
                document.getElementById('estado').value = data.estado;
                document.getElementById('email').value = data.email;
            }
        })

    //Atualiza os dados do usuário
    var btnEnviar = document.getElementById('bt-salvar-usuario');
    btnEnviar.addEventListener('click', function () {
        var usuario = {};
        if (tipo === 'PF') {
            usuario = {
                nome: document.getElementById('nome-completo').value,
                complemento: document.getElementById('data-nascimento').value,
                telefone: document.getElementById('telefone').value,
                cep: document.getElementById('cep').value,
                endereco: document.getElementById('endereco').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value,
                senhaDigitada: document.getElementById('senha').value,
                tipo: 'PF',
                id: idUsuario
            }
        } else if (tipo === 'PJ') {
            usuario = {
                nome: document.getElementById('razao-social').value,
                complemento: document.getElementById('nome-responsavel').value,
                telefone: document.getElementById('telefone').value,
                cep: document.getElementById('cep').value,
                endereco: document.getElementById('endereco').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value,
                senhaDigitada: document.getElementById('senha').value,
                tipo: 'PJ',
                id: idUsuario
            }
        }

        const url = 'editar-usuario';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
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
                document.getElementById('senha').value = null;
                snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);
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

} //fecha function

script_pagina();