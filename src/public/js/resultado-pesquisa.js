var script_pagina = function () {

    //Busca os dados dos pontos de coleta de acordo com pesquisa
    const urlOrigin = window.location.href;
    const parts = urlOrigin.split('/');
    const lastPart = parts[parts.length - 1];
    const searchText = decodeURIComponent(lastPart);

    const url = '/get/resultado-pesquisa/' + searchText;
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
                <div class="mdl-card__title" id="nome-ponto">
                    <i class="material-icons icon-ponto">place</i>
                    <h4 class="mdl-card__title-text font-color-destaque">${obj.nome}</h4>
                </div>
                <div class="mdl-card__supporting-text">
                    <span class="mdl-typography--font-light mdl-typography--subhead">${obj.descricao}</span>
                </div>
                <div class="mdl-card__actions">
                    <a class="mdl-button mdl-js-button card-link mdl-typography--font-light"
                        href="/detalhes-ponto-de-coleta/${obj.id}">
                        Visualizar
                        <i class="material-icons">chevron_right</i>
                    </a>
                </div>
            `; // define o conteúdo da nova div

                document.getElementById('div-pai').appendChild(novaDiv); // adiciona a nova div ao elemento pai
            })

        })
        .catch(error => console.error(error));

    //campo de pesquisa
    const searchField = document.getElementById('search-field');
    searchField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const searchText = event.target.value;
            if (searchText.trim().length != 0) {
                window.location.href = '/resultado-pesquisa/' + searchText;
            }
        };
    });
}
script_pagina();