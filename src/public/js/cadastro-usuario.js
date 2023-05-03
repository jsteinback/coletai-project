var option1Field1 = document.getElementById("1-nome-completo");
var option1Field2 = document.getElementById("1-cpf");
var option1Field3 = document.getElementById("1-data-nascimento");
var option2Field1 = document.getElementById("2-razao-social");
var option2Field2 = document.getElementById("2-cnpj");
var option2Field3 = document.getElementById("2-nome-responsavel");
var option1Radio = document.getElementById("pessoa-fisica");
var option2Radio = document.getElementById("pessoa-juridica");

option1Radio.addEventListener("change", function () {
    option1Field1.style.display = "block";
    option1Field2.style.display = "block";
    option1Field3.style.display = "block";
    option2Field1.style.display = "none";
    option2Field2.style.display = "none";
    option2Field3.style.display = "none";
});

option2Radio.addEventListener("change", function () {
    option1Field1.style.display = "none";
    option1Field2.style.display = "none";
    option1Field3.style.display = "none";
    option2Field1.style.display = "block";
    option2Field2.style.display = "block";
    option2Field3.style.display = "block";
});

var script_pagina = function () {
    var btnEnviar = document.getElementById('bt-cadastro-usuario');
    var inputPessoaFisica = document.getElementById('pessoa-fisica');
    var inputPessoaJuridica = document.getElementById('pessoa-juridica');
    var inputNome = document.getElementById('nome-completo');
    var inputCpf = document.getElementById('cpf');
    var inputData_nascimento = document.getElementById('data-nascimento');
    var inputRazaoSocial = document.getElementById('razao-social');
    var inputCnpj = document.getElementById('cnpj');
    var inputNome_responsavel = document.getElementById('nome-responsavel');
    var inputTelefone = document.getElementById('telefone');
    var inputCep = document.getElementById('cep');
    var inputEndereco = document.getElementById('endereco');
    var inputCidade = document.getElementById('cidade');
    var inputEstado = document.getElementById('estado');
    var inputEmail = document.getElementById('email');
    var inputSenha = document.getElementById('senha');
    var inputConfirmaSenha = document.getElementById('checkSenha');

    //cria o JSON
    btnEnviar.addEventListener('click', function () {
        var usuario = {};
        if (inputPessoaFisica.checked) {
            usuario = {
                email: inputEmail.value,
                senha: inputSenha.value,
                confirmaSenha: inputConfirmaSenha.value,
                tipo: 'PF',
                nome: inputNome.value,
                telefone: inputTelefone.value,
                cep: inputCep.value,
                endereco: inputEndereco.value,
                cidade: inputCidade.value,
                estado: inputEstado.value,
                documento: inputCpf.value,
                complemento: inputData_nascimento.value
            }
        } else if (inputPessoaJuridica.checked) {
            usuario = {
                email: inputEmail.value,
                senha: inputSenha.value,
                confirmaSenha: inputConfirmaSenha.value,
                tipo: 'PJ',
                nome: inputRazaoSocial.value,
                telefone: inputTelefone.value,
                cep: inputCep.value,
                endereco: inputEndereco.value,
                cidade: inputCidade.value,
                estado: inputEstado.value,
                documento: inputCnpj.value,
                complemento: inputNome_responsavel.value
            }
        }

        const url = 'cadastrar-usuario';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
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