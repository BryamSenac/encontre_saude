import { createSidebar } from "../../shared/sidebar.js";
import { createFooter } from "../../shared/footer.js";
import { ROUTES } from "../../config/routes/routes.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Auth Guard: Lógica de Autenticação na Tela
    // Se não existir o item 'isLoggedIn' na memória, joga pro Login
    if (!localStorage.getItem("isLoggedIn")) {
        window.location.href = ROUTES.login;
        return; // Retorna imediatamente para não renderizar/iniciar mais nada
    }

    // 2. Inicia os componentes padrões da interface caso esteja logado
    createSidebar();
    createFooter();

    // 3. Sistema de Logout
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            // Remove a autenticação do seu navegador
            localStorage.removeItem("isLoggedIn");
            // E redireciona você de volta para a tela raiz/home
            window.location.href = ROUTES.home;
        });
    }
});
