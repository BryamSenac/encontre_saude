import { ROUTES } from "../../config/routes/routes.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Lógica do botão de voltar
    const btnBackHome = document.getElementById("btnBackHome");
    if (btnBackHome) {
        btnBackHome.addEventListener("click", () => {
            window.location.href = ROUTES.home;
        });
    }

    // 2. Referências aos formulários
    const btnGoToRegister = document.getElementById("btnGoToRegister");
    const btnGoToLogin = document.getElementById("btnGoToLogin");
    const loginFace = document.querySelector(".login-face");
    const registerFace = document.querySelector(".register-face");
    
    // Função para alternar o formulário que o usuário está vendo
    const toggleForm = () => {
        // Aplica o hidden em um e tira do outro 
        loginFace.classList.toggle("hidden");
        registerFace.classList.toggle("hidden");
    };

    btnGoToRegister.addEventListener("click", toggleForm);
    btnGoToLogin.addEventListener("click", toggleForm);

    // 3. Simula as respostas de submissão do formulário
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Lógica de integração Backend entraria aqui
        alert("Simulação: Login realizado com sucesso!");
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Simulação: Conta criada com sucesso!");
        // Opcional: Redirecionar visual de volta pro Login
        toggleForm();
    });
});
