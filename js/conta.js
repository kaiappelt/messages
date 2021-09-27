let usernameForm = document.getElementById("username");
let passwordForm = document.getElementById("password");
let confirmPasswordForm = document.getElementById("confirmPassword");

let usernameError = document.getElementById("usernameError");
let passwordError = document.getElementById("passwordError");
let confirmPasswordError = document.getElementById("confirmPasswordError");

function insertUser() {
    let users = [];

    if (localStorage.users) {
        users = JSON.parse(localStorage.users);
    } 

    formValidation.setRules(usernameForm.value, "username", "Nome de Usuário", 3);
    formValidation.setRules(passwordForm.value, "password", "Senha", 6);
    formValidation.confirmPasswords(passwordForm.value, confirmPasswordForm.value, "confirmPassword");

    if (formValidation.run()) {
        let newUser = {
            username: usernameForm.value,
            password: passwordForm.value,
            confirmPassword: confirmPasswordForm.value, 
        }
        
        if (!usernameExists(users, usernameForm.value)) {
            users.push(newUser);

            localStorage.setItem("users", JSON.stringify(users));
    
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                html: 'Cadastro realizado com sucesso.'
            }).then(() => window.location.href = 'login.html');
        } else {
            swal.fire("Atenção!", "Este nome de usuário já está cadastrado.", "warning");
        }

    } else {
        usernameError.innerHTML = formValidation.errorMessages.username === undefined ? '' : formValidation.errorMessages.username;
        passwordError.innerHTML = formValidation.errorMessages.password === undefined ? '' : formValidation.errorMessages.password;
        confirmPasswordError.innerHTML = formValidation.errorMessages.confirmPassword === undefined ? '' : formValidation.errorMessages.confirmPassword;
    }
}

function usernameExists(arr, usernameForm) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].username === usernameForm) {
            return true;
        }
    }
}