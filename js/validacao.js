document.addEventListener('DOMContentLoaded', function () {
    const formCadastro = document.getElementById('form-cadastro');

    formCadastro.addEventListener('submit', function (event) {
        // Impede o envio do formulário até que todas as validações sejam realizadas
        event.preventDefault();

        const validName = validarNome();
        const validData = validarData();
        const validTelefone = validarTelefone();
        const validCPF = validarCPF();
        const validEmail = validarEmail();
        const validUsername = validarUsername();
        const validPassword = validarPassword();

        if (validName && validData && validTelefone && validCPF && validEmail && validUsername && validPassword) {
            // Se todas as validações passarem, envia o formulário
            alert('Cadastro realizado com sucesso!');
            formCadastro.submit(); // Envia o formulário para o 'register.php'
        } else {
            alert('Por favor, corrija os erros no formulário antes de prosseguir.');
        }
    });

    function validarNome() {
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        const nameValue = nameInput.value.trim();

        if (nameValue === '') {
            nameError.textContent = 'O nome é obrigatório.';
            nameInput.classList.add('input-error');
            return false;
        } else {
            nameError.textContent = '';
            nameInput.classList.remove('input-error');
            return true;
        }
    }

    function validarData() {
        const dataInput = document.getElementById('data');
        const dataError = document.getElementById('data-error');
        const dataValue = dataInput.value;

        if (dataValue === '') {
            dataError.textContent = 'A data de nascimento é obrigatória.';
            dataInput.classList.add('input-error');
            return false;
        } else {
            dataError.textContent = '';
            dataInput.classList.remove('input-error');
            return true;
        }
    }

    function validarTelefone() {
        const telefoneInput = document.getElementById('telefone');
        const telefoneError = document.getElementById('telefone-error');
        let telefone = telefoneInput.value.replace(/\D/g, '');

        if (telefone.length < 10 || telefone.length > 11) {
            telefoneError.textContent = 'Por favor, insira um telefone válido com DDD.';
            telefoneInput.classList.add('input-error');
            return false;
        } else {
            telefoneError.textContent = '';
            telefoneInput.classList.remove('input-error');
            return true;
        }
    }

    function validarCPF() {
        const cpfInput = document.getElementById('cpf');
        const cpfError = document.getElementById('cpf-error');
        let cpf = cpfInput.value.replace(/\D/g, '');

        if (cpf.length !== 11) {
            cpfError.textContent = 'O CPF deve conter 11 dígitos.';
            cpfInput.classList.add('input-error');
            return false;
        } else {
            cpfError.textContent = '';
            cpfInput.classList.remove('input-error');
            return true;
        }
    }

    function validarEmail() {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailValue)) {
            emailError.textContent = 'Por favor, insira um e-mail válido.';
            emailInput.classList.add('input-error');
            return false;
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('input-error');
            return true;
        }
    }

    function validarUsername() {
        const usernameInput = document.getElementById('username');
        const usernameError = document.getElementById('username-error');
        const usernameValue = usernameInput.value.trim();

        if (usernameValue.length < 3) {
            usernameError.textContent = 'O usuário deve ter pelo menos 3 caracteres.';
            usernameInput.classList.add('input-error');
            return false;
        } else {
            usernameError.textContent = '';
            usernameInput.classList.remove('input-error');
            return true;
        }
    }

    function validarPassword() {
        const passwordInput = document.getElementById('password');
        const passwordError = document.getElementById('password-error');
        const passwordValue = passwordInput.value.trim();

        if (passwordValue.length < 6) {
            passwordError.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            passwordInput.classList.add('input-error');
            return false;
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('input-error');
            return true;
        }
    }
});