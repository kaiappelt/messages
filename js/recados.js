let welcome = document.getElementById("welcome");
let alert = document.getElementById("alertMsg");

let tbody = document.getElementById("tbody");
let descriptionMsg = document.getElementById("descriptionMsg");
let detailsMsg = document.getElementById("detailsMsg");

let dataMessageId = null;

// verificar sessão ativa
function isLogged() {
    let session = localStorage.session;

    if (session === "true") {
        welcomeMsg(); 
        getAll();
    } else {
        window.location.href = 'login.html';
    }
}

// encerra sessão
function logout() {
    localStorage.removeItem("session");
    window.location.href = 'login.html';
}

// mensagem de bem-vindo
function welcomeMsg() {
    let userSession = localStorage.userSession;

    if (! userSession) {
        alert.style.display = "none";
    } else {
        welcome.innerHTML = `Bem vindo ${userSession}`;
        localStorage.removeItem("userSession");
    }
}

// recupera todos os dados da tabela
function getAll() {
    let messages = [];

    if (localStorage.messages) {
        messages = JSON.parse(localStorage.messages);
    } 

    for (let i = 0; i < messages.length; i++) {
        let tr = tbody.insertRow();
        
        let tdId = tr.insertCell();
        let tdDescricao = tr.insertCell();
        let tdDetalhes = tr.insertCell();
        let tdAcoes = tr.insertCell();

        // Cria o botão de editar
        createButton(
            {
                action: "update",
                type: "button",
                class: "btn btn-primary me-1",
                attr: {
                    name: "onclick",
                    value: `getMessageId(${messages[i].id})`,
                }
            },

            tdAcoes 
        );

        // Cria o botão de excluir
        createButton(
            {
                action: "delete",
                type: "button",
                class: "btn btn-danger",
                attr: {
                    name: "onclick",
                    value: `openModalDelete(${messages[i].id})`,
                }
            },
            
            tdAcoes 
        );

        // insere os dados da tabela
        tdId.innerText = messages[i].id;
        tdDescricao.innerText = messages[i].description;
        tdDetalhes.innerText = messages[i].details; 
        
        tdId.className = "text-end";
        tdDescricao.className = "text-start";
        tdDetalhes.className = "text-start";
        tdAcoes.className = "text-center";
    }
    
}

// define a ação 
function core(){
    if(dataMessageId) {
        // editar
        update(dataMessageId);
    } else {
        // inserir
        insertNewMsg();
    }
}

// insere um novo registro
function insertNewMsg() {
    formValidation.setRules(descriptionMsg.value, "descriptionMsg");
    formValidation.setRules(detailsMsg.value, "detailsMsg");

    if (formValidation.run()) {
        let messages = [];

        if(localStorage.messages) {
            messages = JSON.parse(localStorage.messages);
        }

        let newMessage = {
            id: generateUniqueId(messages),
            description: descriptionMsg.value,
            details: detailsMsg.value
        } 

        messages.push(newMessage);

        localStorage.setItem("messages", JSON.stringify(messages));

        swal.fire("Sucesso!", "Dados salvos com sucesso.", "success")

        clearAll();

    } else {
        let errorDescription = formValidation.errorMessages.descriptionMsg;
        let errorDetails = formValidation.errorMessages.detailsMsg;

        if (errorDescription) {
            descriptionMsg.style.border = "1px solid #ff0000";
        } else {
            descriptionMsg.style.border = "1px solid #ced4da";
        }

        if (errorDetails) {
            detailsMsg.style.border = "1px solid #ff0000";
        } else {
            detailsMsg.style.border = "1px solid #ced4da";
        }

        swal.fire("Atenção!", "Preencha os campos obrigatórios", "warning");
    }
}

// recupera um registro pelo id
function getMessageId(id){
    if (id){
        let messages = [];

        if(localStorage.messages) {
            messages = JSON.parse(localStorage.messages);
        }
        
        dataMessageId = id;

        for(let i = 0; i < messages.length; i++){
            if (messages[i].id === dataMessageId) {
                descriptionMsg.value = messages[i].description;
                detailsMsg.value = messages[i].details;
            }
        }

    } else {
        swal.fire("Atenção!", "Registro não encontrado.", "warning");
    }

}

// edita um registro existente
function update(dataId) {
    formValidation.setRules(descriptionMsg.value, "descriptionMsg");
    formValidation.setRules(detailsMsg.value, "detailsMsg");

    if (formValidation.run()) {
        let messages = [];

        if(localStorage.messages) {
            messages = JSON.parse(localStorage.messages);
        }

        for (let i = 0; i < messages.length; i++){
            if(messages[i].id === dataId) {
                messages[i].description = descriptionMsg.value;
                messages[i].details = detailsMsg.value;
            }
        }

        localStorage.setItem("messages", JSON.stringify(messages));

        swal.fire("Sucesso!", "Dados salvos com sucesso.", "success")

        clearAll();

    } else {
        let errorDescription = formValidation.errorMessages.descriptionMsg;
        let errorDetails = formValidation.errorMessages.detailsMsg;

        if (errorDescription) {
            descriptionMsg.style.border = "1px solid #ff0000";
        } else {
            descriptionMsg.style.border = "1px solid #ced4da";
        }

        if (errorDetails) {
            detailsMsg.style.border = "1px solid #ff0000";
        } else {
            detailsMsg.style.border = "1px solid #ced4da";
        }

        swal.fire("Atenção!", "Preencha os campos obrigatórios", "warning");
    }
}

// exibi a modal com a pergunta de confirmação de exclusão
function openModalDelete(dataId){
    Swal.fire({
        title: "Deseja excluir este registro?",
        icon: "warning",
        showDenyButton: "Sim",
        denyButtonText: "Não",
    }).then((result) => {
        if(result.isConfirmed){
            deleteMessage(dataId);
        } else if (result.isDenied) {}
    })
}

// exclui o registro
function deleteMessage(dataId){
    let messages = [];

    if(localStorage.messages) {
        messages = JSON.parse(localStorage.messages);
    }

    if (dataId){
        for(let i = 0; i < messages.length; i++){
            if(messages[i].id === dataId) {
                messages.splice(i, 1);
            }
        }

        localStorage.setItem("messages", JSON.stringify(messages));

        swal.fire("Sucesso!", "Registro excluído com sucesso.", "success");

        clearAll();

    } else{
        swal.fire("Atenção!", "Registro não encontrado.", "warning");
    }
}


//Cria um elemento button
function createButton(attributes, el) {
    let btn = document.createElement("button");

    btn.type = attributes.type;
    btn.className = attributes.class;
    btn.setAttribute(attributes.attr.name, attributes.attr.value);

    if (attributes.action === "update") {
        // cria um elemento ícone utilizando as classes do fontawesome
        let i = document.createElement("i");
        i.className = "fas fa-edit";
        
        btn.appendChild(i);
    }

    
    if (attributes.action === "delete") {
        // cria um elemento ícone utilizando as classes do fontawesome
        let i = document.createElement("i");
        i.className = "fas fa-trash-alt";
        
        btn.appendChild(i);
    }

    el.appendChild(btn);
}

// gera um id único para a inserção de registros
function generateUniqueId(arr) {
    let maxId = null;
    
    for (let i = 0; i < arr.length; i++){
        maxId = Math.max(arr[i].id);
    }

    return maxId + 1;
}

// limpa tudo
function clearAll(){
    tbody.innerHTML = "";
    descriptionMsg.value = "";
    detailsMsg.value = "";

    descriptionMsg.style.border = "1px solid #ced4da";
    detailsMsg.style.border = "1px solid #ced4da";
    dataMessageId = null;

    getAll();
}