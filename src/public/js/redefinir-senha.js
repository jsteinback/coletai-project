var script_pagina = function () {

    const token = localStorage.getItem('token');

    document.getElementById('bt-salvar').addEventListener('click', () => {
        var inputSenha = document.getElementById('senha');
        var inputConfirmaSenha = document.getElementById('checkSenha');
        novaSenha = {
            senha: inputSenha.value,
            checkSenha: inputConfirmaSenha.value
        }

        const url = 'redefinir-senha-post';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify(novaSenha)
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
                const snackbarContainer = document.querySelector('#snackbar-container-success')
                const snackbarData = {
                    message: data.message,
                    timeout: 2750
                }
                document.getElementById('senha').value = null;
                document.getElementById('checkSenha').value = null;
                snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);
            })
            .catch(error => console.error(error));
    });
};

script_pagina();