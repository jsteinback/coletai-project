var script_pagina = function () {
    var btnSalvar = document.getElementById('bt-salvar');

    btnSalvar.addEventListener('click', function () {
        novaSenha = {
            senha: document.getElementById('senha').value,
            confirmaSenha: document.getElementById('confirma-senha').value
        }

        const url = 'redefinir-senha';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaSenha)
        };

        fetch(url, options)
            .then(response => {
                    return response.json();
            })
            .then(data => {
                window.location.href = data.redirectUrl; //redireciona pra página home autenticada
            })
            .catch(error => console.error(error));
    });
};

script_pagina();