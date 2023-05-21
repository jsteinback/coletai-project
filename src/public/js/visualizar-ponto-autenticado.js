var script_pagina = function () {
    const botoesEstrela = document.querySelectorAll('.icon-classificacao');
    const botaoFavorito = document.querySelector('.icon-favorito');
    const token = localStorage.getItem('token');

    document.getElementById('btn-sair').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/pagina-inicial';
    });

    //Busca os dados do ponto de coleta
    var idPonto = window.location.pathname.match(/\/(\d+)$/)[1];
    const url = '/view-detalhes-ponto-de-coleta-auth/' + idPonto;
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
                    botao.classList.add('classificado');
                } else {
                    botao.classList.remove('classificado');
                    botao.classList.add('icon-desabilitado');
                }
            })

            //atualiza cor do favorito
            if (data.favorito === true) {
                botaoFavorito.classList.remove('icon-desabilitado')
                botaoFavorito.classList.add('favoritado')
            } else if (data.favorito === false) {
                botaoFavorito.classList.remove('favoritado')
                botaoFavorito.classList.add('icon-desabilitado')
            }

            //cria os comentários
            data.comentarios.forEach(obj => { // loop sobre os dados retornados da requisição
                let data = new Date(obj.dt_comentario);
                let dataFormatada = data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

                //cria o elemento que recebe os comentarios
                const divComentario = document.createElement('li');
                divComentario.classList.add('mdl-list__item', 'mdl-list__item--three-line');
                divComentario.id = `comentario-${obj.id}`;
                divComentario.innerHTML = `
                    <span class="mdl-list__item-primary-content">
                        <span id="usuario-comentario" class="titulo-comentario">${obj.nome}</span>
                        <span id="data-comentario" class="data-comentario">${dataFormatada}</span>
                        <span id="texto-comentario" class="mdl-list__item-text-body texto-comentario">${obj.comentario}</span>
                    </span>
                    <span class="mdl-list__item-secondary-content acao-comentario">
                        <button class="mdl-button mdl-js-button mdl-button--icon" id="bt-responder" title="Responder" onclick="bt_responder(this, '${obj.id}', '${obj.id_ponto}')">
                            <i class="material-icons">reply</i>
                        </button>
                    </span>
                `;
                document.querySelector('.ul-comentarios').appendChild(divComentario);

                // Criação das respostas
                if (obj.respostas) {
                    obj.respostas.forEach(resposta => {
                        const divRespostas = document.createElement('ul'); // Cria um elemento para armazenar as respostas
                        divRespostas.classList.add('mdl-list', 'ul-respostas');
                        const comentarioAtual = document.querySelector(`#comentario-${obj.id}`); // Procura o elemento de comentário atual pelo ID do comentário
                        comentarioAtual.appendChild(divRespostas); // Vincula o elemento de respostas dentro do elemento de comentário atual
                        const respostasComentarioAtual = obj.respostas.filter(res => res.id_pai === obj.id); // Procura as respostas para o comentário atual
                        // Cria as respostas
                        respostasComentarioAtual.forEach(res => {
                            let dataResposta = new Date(res.dt_comentario);
                            let dataRespostaFormatada = dataResposta.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                            const divResposta = document.createElement('li');
                            divResposta.classList.add('mdl-list__item', 'mdl-list__item--three-line', 'li-respostas');
                            divResposta.innerHTML = `
                            <span class="mdl-list__item-primary-content">
                                <span id="usuario-comentario" class="titulo-comentario">${res.nome}</span>
                                <span id="data-comentario" class="data-comentario">${dataRespostaFormatada}</span>
                                <span id="texto-comentario" class="mdl-list__item-text-body texto-comentario">${res.comentario}</span>
                            </span>`;
                            divRespostas.appendChild(divResposta); // Vincula o elemento de resposta dentro do elemento de respostas
                        });
                    });
                }
            })
        })


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

    //Botão favoritar
    document.getElementById('btn-favoritar').addEventListener('click', () => {

        const url = '/fav-ponto-de-coleta/' + idPonto;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            }
        }

        requisicao(url, options)
            .then(data => {
                //show snackbar
                const snackbarContainer = document.querySelector('#snackbar-container-success')
                const snackbarData = {
                    message: data.message,
                    timeout: 2750
                }
                snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);

                //atualiza cor do ícone
                if (data.favNovo === true) {
                    botaoFavorito.classList.remove('icon-desabilitado')
                    botaoFavorito.classList.add('favoritado')
                } else if (data.favNovo === false) {
                    botaoFavorito.classList.remove('favoritado')
                    botaoFavorito.classList.add('icon-desabilitado')
                }
            })
    });

    //Classificação
    botoesEstrela.forEach(botao => {
        botao.addEventListener('click', function () {
            // Define a classificação atual como o índice do botão clicado
            const classificacao = Array.from(botoesEstrela).indexOf(botao) + 1;

            // Envia a requisição para atualizar a classificação no servidor
            const url = '/rate-ponto-de-coleta/' + idPonto;
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

            requisicao(url, options)
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
                            botao.classList.add('classificado');
                        } else {
                            botao.classList.remove('classificado');
                            botao.classList.add('icon-desabilitado');
                        }
                    })
                })
        });
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

    //adicionar comentário
    document.getElementById('bt-comentar').addEventListener('click', () => {
        event.preventDefault();
        const comentario = document.getElementById('input-comentario').value;
        if (comentario.trim().length != 0) {

            // Salvar comentário
            const url = '/add-comentario/' + idPonto;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                },
                body: JSON.stringify(
                    {
                        comentario: comentario
                    })
            };

            requisicao(url, options)
                .then(data => {
                    console.log(data);
                    window.location.reload();
                })
        }

    });

    //Botão compartilhar
    document.getElementById('btn-share').addEventListener('click', () => {
        const texto = 'Conheça este Ponto de Coleta! https://coletaiapp.herokuapp.com/detalhes-ponto-de-coleta/' + idPonto;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
        window.open(url, '_blank');
    });

} //fecha function

script_pagina();

function bt_responder(button, idPai, idPonto) {
    button.disabled = true;

    // Obtém o elemento pai do botão (li)
    const comentario = button.closest('li');

    // Cria a div para inserção do comentário de resposta
    const divResposta = document.createElement('div');
    divResposta.classList.add('mdl-cell', 'mdl-cell--5-col', 'mdl-textfield', 'mdl-js-textfield', 'mdl-textfield--floating-label', 'mdl-textfield--align-top');

    // Cria a textarea
    const textarea = document.createElement('textarea');
    textarea.classList.add('mdl-textfield__input', 'text-disabled');
    textarea.type = 'text';
    textarea.rows = '1';
    textarea.id = 'input-resposta';

    // Cria a label da textarea
    const label = document.createElement('label');
    label.classList.add('mdl-textfield__label', 'title-disabled');
    label.htmlFor = 'resposta';
    //label.textContent = 'Responder comentário...';

    // Anexa a textarea e a label à div de resposta
    divResposta.appendChild(textarea);
    divResposta.appendChild(label);

    // Cria o botão de comentar
    const divBotao = document.createElement('div');
    divBotao.classList.add('mdl-cell', 'mdl-cell--1-col');

    const btResponder = document.createElement('button');
    btResponder.id = 'bt-responder';
    btResponder.type = 'submit';
    btResponder.classList.add('mdl-button', 'mdl-js-button', 'mdl-button--fab', 'mdl-button--mini-fab', 'mdl-button--colored', 'coletai-botao-comentario');
    btResponder.onclick = function () {
        responderComentario(button, idPai, idPonto);
    }


    const icon = document.createElement('i');
    icon.classList.add('material-icons');
    icon.textContent = 'add';

    btResponder.appendChild(icon);
    divBotao.appendChild(btResponder);

    // Anexa a div de resposta e o botão à li do comentário
    comentario.appendChild(divResposta);
    comentario.appendChild(divBotao);
}

function responderComentario(button, idPai, idPonto) {
    const token = localStorage.getItem('token');
    const comentario = document.getElementById('input-resposta').value;

    if (comentario.trim().length != 0) {

        // Salvar resposta
        const url = '/add-resposta';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify(
                {
                    comentario: comentario,
                    idPai: idPai,
                    idPonto: idPonto
                })
        };

        requisicao(url, options)
            .then(data => {
                console.log(data);
                window.location.reload();
            })
    }
}