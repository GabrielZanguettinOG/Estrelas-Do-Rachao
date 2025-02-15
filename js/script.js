// Selecionando elementos

const addUserBtn = document.querySelector(".add-user");
const userInput = document.querySelector("#user-content");
const usersContainer = document.querySelector("#users-container");
const messageContainer = document.querySelector("#message-container");

// Funções 

function createUser(id, content, stars, purpleStars) {
    const div = document.createElement("div");
    div.classList.add("user");
    
    const starsContainer = document.createElement("div");
    starsContainer.classList.add("stars-container");
    div.appendChild(starsContainer);

    const h3 = document.createElement("h3");
    h3.innerText = content;
    div.appendChild(h3);

    const buttonPlusIcon = document.createElement("button");
    buttonPlusIcon.classList.add("add-star")
    div.appendChild(buttonPlusIcon);

    const plusIcon = document.createElement("i");
    plusIcon.classList.add(...["bi", "bi-plus-lg"]);
    buttonPlusIcon.appendChild(plusIcon);

    const buttonTrashIcon = document.createElement ("button");
    buttonTrashIcon.classList.add("delete-user");
    div.appendChild(buttonTrashIcon);

    const trashIcon = document.createElement("i");
    trashIcon.classList.add(...["bi", "bi-trash"]);
    buttonTrashIcon.appendChild(trashIcon);

    div.querySelector(".add-star").addEventListener("click", () => {
        addStars(id, starsContainer, buttonPlusIcon);
    })
    div.querySelector(".delete-user").addEventListener("click", () => {
        deleteUser(id, div);
    })

    if (purpleStars) {
        for (let i = 0; i < purpleStars; i++) {
            const purpleStarIcon = document.createElement("i");
            purpleStarIcon.classList.add(...["bi", "bi-star", "purple"]);
            starsContainer.appendChild(purpleStarIcon);
        }
    }
    if (stars) {
        for (let i = 0; i < stars; i++) {
            const starIcon = document.createElement("i");
            starIcon.classList.add(...["bi", "bi-star", "gold"]);
            starsContainer.appendChild(starIcon);
        }
    }
    return div;
}

function generateId() {
    return Math.floor(Math.random() * 5000);
}

function addUser() {
    if (!userInput.value.trim()) return;

    try {
        const users = getUsersLocalStorage();
        addUserBtn.disabled = true;

        const userObject = {
            id: generateId(),
            nome: userInput.value,
            stars: 0,
            purpleStars: 0
        };


        messageContainer.innerHTML = ""; 
        const span = document.createElement("span");
        span.innerText = "Jogador adicionado com sucesso!";
        messageContainer.appendChild(span);

        setTimeout(() => span.classList.toggle("transitioned"), 0.1);
        setTimeout(() => span.classList.toggle("transitioned"), 2000);
        setTimeout(() => messageContainer.removeChild(span), 3000);

        const userElement = createUser(userObject.id, userObject.nome, userObject.stars, userObject.purpleStars);
        usersContainer.appendChild(userElement);

        users.push(userObject)

        userInput.value = "";

        saveUsersLocalStorage(users);

    } catch (error) {
        console.error("Erro ao adicionar usuário:", error.message);
    } finally {
        addUserBtn.disabled = false;
    }
}

function showUsers() {
    try {
        const users = getUsersLocalStorage()
        usersContainer.innerHTML = "";

        users.forEach((user) => {
            const userElement = createUser(user.id, user.nome, user.stars, user.purpleStars);
            usersContainer.appendChild(userElement);
        });
    } catch (error) {
        console.error("Erro ao exibir usuários:", error.message);
    }
}

function addStars(id, starsContainer) {
    try {
        const users = getUsersLocalStorage();
        const userFiltred = users.filter((user) => user.id === id)[0]

        if (userFiltred.stars === 9) {
            userFiltred.stars = 0
            userFiltred.purpleStars += 1;
        } else {
            userFiltred.stars += 1
        }

        updateStarsUI(starsContainer, userFiltred.stars, userFiltred.purpleStars);

        saveUsersLocalStorage(users);

    } catch (error) {
        console.error("Erro ao adicionar estrela:", error.message);
    }
}

function updateStarsUI(starsContainer, stars, purpleStars) {
    starsContainer.innerHTML = "";

    for (let i = 0; i < purpleStars; i++) {
        const purpleStarIcon = document.createElement("i");
        purpleStarIcon.classList.add(...["bi", "bi-star", "purple"]);
        starsContainer.appendChild(purpleStarIcon);
    }

    for (let i = 0; i < stars; i++) {
        const starIcon = document.createElement("i");
        starIcon.classList.add(...["bi", "bi-star", "gold"]);
        starsContainer.appendChild(starIcon);
    }
}

function deleteUser(id, div) {
    try {
        const users = getUsersLocalStorage().filter((user) => user.id !== id);
        usersContainer.removeChild(div);

        messageContainer.innerHTML = ""; 
        const span = document.createElement("span");
        span.classList.add("red");
        span.innerText = "Jogador deletado com sucesso!";
        messageContainer.appendChild(span);

        setTimeout(() => span.classList.toggle("transitioned"), 50);
        setTimeout(() => span.classList.toggle("transitioned"), 2000);
        setTimeout(() => messageContainer.removeChild(span), 3000);

        saveUsersLocalStorage(users);
        
    } catch (error) {
        console.error("Erro ao deleter usuário:", error.message);
    }
}

function getUsersLocalStorage() {
    const usersLocalStorage = JSON.parse(localStorage.getItem("users") || "[]");
    return usersLocalStorage;
}

function saveUsersLocalStorage(users) {
    localStorage.setItem("users", JSON.stringify(users))
} 

// Eventos

addUserBtn.addEventListener("click", () => {
    addUser();
})

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addUser();
    };
});

// Inicialização

showUsers();