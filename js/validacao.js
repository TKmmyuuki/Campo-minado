// Função de validação do nome completo
function validarNome() {
    const nome = document.getElementById('name').value;
    if (nome.length < 3) {
        alert('O nome completo deve ter pelo menos 3 caracteres.');
        return false;
    }
    return true;
}

// Função de validação do telefone
function validarTelefone() {
    const telefone = document.getElementById('telefone').value;
    const telefoneRegex = /^\(\d{2}\)\d{5}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
        alert('O telefone deve estar no formato (XX)XXXXX-XXXX');
        return false;
    }
    return true;
}

// Função de validação do e-mail
function validarEmail() {
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Digite um e-mail válido.');
        return false;
    }
    return true;
}

// Função de validação do nome de usuário
function validarUsuario() {
    const username = document.getElementById('username').value;
    if (username.length < 3) {
        alert('O nome de usuário deve ter pelo menos 3 caracteres.');
        return false;
    }
    return true;
}

// Função de validação da senha
function validarSenha() {
    const password = document.getElementById('password').value;
    if (password.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return false;
    }
    return true;
}


// Função de validação do CPF
function validarCPF() {
    const cpf = document.getElementById('cpf').value;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; // Formato: xxx.xxx.xxx-xx
    if (!cpfRegex.test(cpf)) {
        alert('O CPF deve estar no formato xxx.xxx.xxx-xx');
        return false;
    }
    return true;
}

// Função de validação da data
function validarData() {
    const data = document.getElementById('data').value;
    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Formato: dd/mm/aaaa
    if (!dataRegex.test(data)) {
        alert('A data deve estar no formato dd/mm/aaaa');
        return false;
    }
    return true;
}

function verificarAtualizacao() {
    if (
        validarNome() &&
        validarTelefone() &&
        validarEmail() &&
        validarUsuario() &&
        validarSenha()
    ) {
        alert("Informações atualizadas!"); 
        window.location.href = "index.html";
    }
}

function verificarCadastro() {
    if (
        validarNome() &&
        validarTelefone() &&
        validarEmail() &&
        validarUsuario() &&
        validarSenha() &&
        validarCPF() &&
        validarData()
    ) {
        alert("Perfil cadastrado!"); 
        window.location.href = "login.html";
    }
}