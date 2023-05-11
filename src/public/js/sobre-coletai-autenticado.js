var script_pagina = function () {

    const token = localStorage.getItem('token');

    document.getElementById('btn-sair').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/api/pagina-inicial';
    });

    //Busca os dados dos pontos de coleta
    const url = '/api/auth/sobre-auth';
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': token
        }
    };

    requisicao(url, options)
        .then(data => {
            console.log(data);
        })

}
script_pagina();