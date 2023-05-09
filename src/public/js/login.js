var script_pagina = function () {
    var btnEnviar = document.getElementById('bt-login');
    var inputEmail = document.getElementById('email');
    var inputSenha = document.getElementById('senha');

    btnEnviar.addEventListener('click', function () {
        usuario = {
            email: inputEmail.value,
            senha: inputSenha.value
        }

        const url = 'login';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        };

        fetch(url, options)
            .then(response => {
                if (response.status === 422 || response.status === 401 || response.status === 404) {
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
                localStorage.setItem('token', data.token);
                window.location.href = data.redirectUrl; //redireciona pra página home autenticada
            })
            .catch(error => console.error(error));
    });
};

script_pagina();