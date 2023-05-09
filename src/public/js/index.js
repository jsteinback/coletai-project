var script_pagina = function () {

    //Busca os dados dos pontos de coleta
    const url = 'all/pagina-inicial';
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
            data.forEach(obj => { // loop sobre os dados retornados da requisição
                const novaDiv = document.createElement('div'); // cria um novo elemento div
                novaDiv.classList.add('mdl-cell', 'mdl-cell--3-col', 'mdl-card', 'mdl-shadow--3dp'); // define suas classes
                novaDiv.innerHTML = `
                <div class="mdl-card__media">
                    <img src="/images/fundo-imagem.png">
                </div>
                <div class="mdl-card__title" id="nome-ponto">
                    <h4 class="mdl-card__title-text font-color-destaque">${obj.nome}</h4>
                </div>
                <div class="mdl-card__supporting-text">
                    <span class="mdl-typography--font-light mdl-typography--subhead">${obj.descricao}</span>
                </div>
                <div class="mdl-card__actions">
                    <a class="mdl-button mdl-js-button card-link mdl-typography--font-light"
                        href="/api/detalhes-ponto-de-coleta">
                        Visualizar
                        <i class="material-icons">chevron_right</i>
                    </a>
                </div>
            `; // define o conteúdo da nova div

                document.getElementById('div-pai').appendChild(novaDiv); // adiciona a nova div ao elemento pai
            })
        })
        .catch(error => console.error(error));


}
script_pagina();