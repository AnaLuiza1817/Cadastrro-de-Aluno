document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('formCadastroAluno');
    const btnLimpar = document.getElementById('btnLimparForm');
    
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');
    
    const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucesso'), {
        backdrop: 'static',
        keyboard: false
    });
    
    function aplicarMascaraCPF(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .slice(0, 14);
    }
    
    function aplicarMascaraTelefone(value) {
        let numeros = value.replace(/\D/g, '');
        if (numeros.length <= 10) {
            return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').slice(0, 14);
        } else {
            return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15);
        }
    }
    
    function aplicarMascaraCEP(value) {
        return value.replace(/\D/g, '').replace(/(\d{5})(\d{1,3})/, '$1-$2').slice(0, 9);
    }
    
    if(cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraCPF(e.target.value);
        });
    }
    if(telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraTelefone(e.target.value);
        });
    }
    if(cepInput) {
        cepInput.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraCEP(e.target.value);
        });
    }
    
    function validarCPF(cpf) {
        let cpfLimpo = cpf.replace(/\D/g, '');
        if (cpfLimpo.length !== 11) return false;
        const sequenciasInvalidas = [
            '00000000000', '11111111111', '22222222222', '33333333333',
            '44444444444', '55555555555', '66666666666', '77777777777',
            '88888888888', '99999999999'
        ];
        if (sequenciasInvalidas.includes(cpfLimpo)) return false;
        
        // Validação dos dígitos verificadores
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digitoVerificador1 = (resto === 10 || resto === 11) ? 0 : resto;
        if (digitoVerificador1 !== parseInt(cpfLimpo.charAt(9))) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digitoVerificador2 = (resto === 10 || resto === 11) ? 0 : resto;
        return digitoVerificador2 === parseInt(cpfLimpo.charAt(10));
    }
    
    function validarFormularioCompleto(event) {
        event.preventDefault();
        let formValido = true;
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            formValido = false;
        } else {
            form.classList.remove('was-validated');
        }
        
        const cpf = cpfInput.value;
        if (cpfInput.value.trim() !== "" && !validarCPF(cpf)) {
            cpfInput.classList.add('is-invalid');
            cpfInput.nextElementSibling.innerText = 'CPF inválido (números incorretos ou dígitos inválidos).';
            formValido = false;
        } else {
            cpfInput.classList.remove('is-invalid');
            if(cpfInput.classList.contains('is-invalid')) cpfInput.classList.remove('is-invalid');
        }
        
        const senha = senhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;
        
        if (senha !== confirmarSenha) {
            confirmarSenhaInput.classList.add('is-invalid');
            confirmarSenhaInput.nextElementSibling.innerText = 'As senhas não coincidem.';
            formValido = false;
        } else {
            confirmarSenhaInput.classList.remove('is-invalid');
        }
        
        if (senha.length < 6 && senha.length > 0) {
            senhaInput.classList.add('is-invalid');
            senhaInput.nextElementSibling.innerText = 'A senha deve ter no mínimo 6 caracteres.';
            formValido = false;
        } else if(senhaInput.validity && !senhaInput.validity.valueMissing && senha.length >= 6) {
            senhaInput.classList.remove('is-invalid');
        }
        
        const dataNasc = document.getElementById('dataNascimento').value;
        if(dataNasc) {
            const dataObj = new Date(dataNasc);
            const hoje = new Date();
            if(dataObj > hoje) {
                document.getElementById('dataNascimento').classList.add('is-invalid');
                const feedbackDiv = document.getElementById('dataNascimento').nextElementSibling;
                if(feedbackDiv) feedbackDiv.innerText = 'Data de nascimento não pode ser futura.';
                formValido = false;
            } else {
                document.getElementById('dataNascimento').classList.remove('is-invalid');
            }
        }
        
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(email && !emailRegex.test(email)) {
            document.getElementById('email').classList.add('is-invalid');
            formValido = false;
        }
        
        if (formValido) {
            const nomeAluno = document.getElementById('nomeCompleto').value;
            const matricula = document.getElementById('matricula').value;
            
            document.getElementById('modalNomeAluno').innerText = nomeAluno;
            document.getElementById('modalMatricula').innerText = matricula;
            
            modalSucesso.show();
            
            document.getElementById('modalSucesso').addEventListener('hidden.bs.modal', function() {
            }, { once: true });
        } else {
            const primeiroErro = form.querySelector('.is-invalid');
            if (primeiroErro) {
                primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
                primeiroErro.focus();
            }
        }
    }
    
    form.addEventListener('submit', validarFormularioCompleto);

    btnLimpar.addEventListener('click', () => {
        form.reset();
        form.classList.remove('was-validated');
        const invalidFields = form.querySelectorAll('.is-invalid');
        invalidFields.forEach(field => field.classList.remove('is-invalid'));
        const allInputs = form.querySelectorAll('input, select');
        allInputs.forEach(input => {
            input.classList.remove('is-invalid');
            if(input.type !== 'submit' && input.type !== 'button') {
            
            }
        });
    
        document.getElementById('nomeCompleto').focus();
    });
    
    function checkSenhaMatch() {
        if(confirmarSenhaInput.value !== senhaInput.value && confirmarSenhaInput.value !== "") {
            confirmarSenhaInput.setCustomValidity("As senhas não coincidem");
            confirmarSenhaInput.classList.add('is-invalid');
        } else {
            confirmarSenhaInput.setCustomValidity("");
            confirmarSenhaInput.classList.remove('is-invalid');
        }
    }
    
    senhaInput.addEventListener('input', checkSenhaMatch);
    confirmarSenhaInput.addEventListener('input', checkSenhaMatch);
    
    const originalValidate = validarFormularioCompleto;
    window.validarFormularioCompleto = originalValidate;
});