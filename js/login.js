let username = document.getElementById("username");
let password = document.getElementById("password");

function login() {
    let users = []; 

    if (localStorage.users) {
        users = JSON.parse(localStorage.users);
    } 

    formValidation.setRules(username.value);
    formValidation.setRules(password.value);

    if (formValidation.run()) {
        let result = getUser(users, username.value, password.value);

        if (result) {
            localStorage.setItem("session", "true");
            localStorage.setItem("userSession", username.value);
            window.location.href = "recados.html";
        } else {
            swal.fire ("Atenção!", "Usuário ou Senha incorretos.", "warning");
        }

    } else {
        swal.fire("Atenção!", "Digite suas credenciais de acesso.", "warning");
    }

}

function getUser(arr, username, password) {
    for (let i = 0; i < arr.length; i++) {
        if ( (username === arr[i].username) && (password === arr[i].password) ) {
            return true;
        } 
    }
}

