import { ROUTES } from "../../config/routes/routes.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Botão de Voltar para Login Principal
    const btnBackLogin = document.getElementById("btnBackLogin");
    if (btnBackLogin) {
        btnBackLogin.addEventListener("click", () => {
            window.location.href = ROUTES.login;
        });
    }

    // Identidades do FLUXO DE COMPONENTES
    const faceEmail = document.getElementById("faceEmail");
    const faceNovaSenha = document.getElementById("faceNovaSenha");

    // 2. Etapa Um: Formulário do Email (Pedir Reset a API)
    const emailForm = document.getElementById("emailForm");
    emailForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Lógica real que seu colega vai fazer: supabase.auth.resetPasswordForEmail()
        
        // Oculta área do Email e vai instantaneamente para testar a redefinição de Senha
        faceEmail.classList.add("hidden");
        faceNovaSenha.classList.remove("hidden");
    });

    // 4. Submit de Reset com Segurança Completa simulada
    const novaSenhaForm = document.getElementById("novaSenhaForm");
    novaSenhaForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const pwd1 = document.getElementById("newPassword").value;
        const pwd2 = document.getElementById("confirmNewPassword").value;

        if (pwd1 !== pwd2) {
            alert("As senhas não coincidem. Tente novamente.");
            return;
        }

        // Sucesso do Supabase (Update Row) Simulativo
        localStorage.setItem("isLoggedIn", "true");
        alert("Senha Atualizada no Supabase com Sucesso! Bem Vindo de volta.");
        window.location.href = ROUTES.perfil;
    });

});
