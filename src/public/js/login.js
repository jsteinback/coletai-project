var script_pagina = function () {
    var btnEnviar = document.getElementById('bt-login');
    var inputEmail = document.getElementById('email');
    var inputSenha = document.getElementById('senha');

    btnEnviar.addEventListener('click', function () {
        var email = inputEmail.value
        var senha = inputSenha.value

        const url = 'login';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        };

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                const token = data.token;
                if (token) {
                    localStorage.setItem('token', token);
                    window.location.href = data.redirectUrl;
                }
            })
            .catch(error => console.error(error));
    });
};

script_pagina();