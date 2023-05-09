var script_pagina = function () {
    const botoesEstrela = document.querySelectorAll('.icon-classificacao');
    const token = localStorage.getItem('token');

    document.getElementById('btn-sair').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/api/pagina-inicial';
    });

    //Busca os dados do ponto de coleta
    var idPonto = window.location.pathname.match(/\/(\d+)$/)[1];
    const url = '/api/view/ponto-de-coleta/' + idPonto;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        }
    };

    requisicao(url, options)
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
                    botao.classList.add('favoritado');
                } else {
                    botao.classList.remove('favoritado');
                    botao.classList.add('icon-desabilitado');
                }
            })
        })

    //Botão favoritar
    /*
    document.getElementById('btn-favoritar').addEventListener('click', () => {
        const url = '/api/fav/ponto-de-coleta/' + idPonto;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            }
        };

        fetch(url, options)
                .then(response => {
                    if (response.status === 200) {
                        const iconElement = document.querySelector('#btn-favoritar i');
                        iconElement.classList.toggle('favoritado');
                      }
                      return response.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => console.error(error));
    });
    */

    //Classificação
    botoesEstrela.forEach(botao => {
        botao.addEventListener('click', function () {
            // Define a classificação atual como o índice do botão clicado
            const classificacao = Array.from(botoesEstrela).indexOf(botao) + 1;

            // Envia a requisição para atualizar a classificação no servidor
            const url = '/api/rate/ponto-de-coleta/' + idPonto;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                },
                body: JSON.stringify(
                    {
                        classificacao: classificacao
                    })
            };

            fetch(url, options)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    //show snackbar
                    const snackbarContainer = document.querySelector('#snackbar-container-success')
                    const snackbarData = {
                        message: data.message,
                        timeout: 2750
                    }
                    snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);

                    //atualiza cor das estrelas
                    botoesEstrela.forEach((botao, index) => {
                        if (index < classificacao) {
                            botao.classList.remove('icon-desabilitado');
                            botao.classList.add('favoritado');
                        } else {
                            botao.classList.remove('favoritado');
                            botao.classList.add('icon-desabilitado');
                        }
                    })
                })
                .catch(error => console.error(error));
        });
    });

} //fecha function

script_pagina();