import { createSidebar } from "../../shared/sidebar.js";
import { createFooter } from "../../shared/footer.js";
import { ROUTES } from "../../config/routes/routes.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Auth Guard (Simulado para que colegas continuem testando fluxo de bloqueios)
    if (!localStorage.getItem("isLoggedIn")) {
        window.location.href = ROUTES.login;
        return; 
    }

    createSidebar();
    createFooter();

    // 2. Sistema de Logout
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("isLoggedIn");
            window.location.href = ROUTES.home;
        });
    }

    // 3. Captura os dados do Formulário Vazio x Preenchido e converte String Vazia em Null global
    const perfilForm = document.getElementById("perfilForm");
    
    perfilForm.addEventListener("submit", (e) => {
        e.preventDefault();

        /*
           * ENGINE DO SUPABASE:
           * Campos vazios (Strings sem conteudo, length == 0) devem ser submetidos 
           * estritamente como NULL para o banco para ele lidar com o Update de row perfeitamente.
           * Nomes e variáveis escritas extamente nos tipos (typeof) requisitados.
        */
        const getFieldVal = (id, type) => {
            const rawVal = document.getElementById(id).value.trim();
            if (rawVal === "") return null;
            if (type === "number") return Number(rawVal);
            return rawVal; 
        }

        // Monta o payload idêntico à Estrutura das Tabelas listadas!
        const payload = {
            id_usuario: "123e4567-e89b-12d3-a456-426614174000", /* Exemplo Padrão UUID Supabase Auth.uid()*/
            sexo: getFieldVal("sexo", "string"),
            idade: getFieldVal("idade", "number"),
            peso: getFieldVal("peso", "number"),
            altura: getFieldVal("altura", "number"),
            fuma: document.querySelector('input[name="fuma"]:checked').value === "true",
            bebe: document.querySelector('input[name="bebe"]:checked').value === "true",
            alergia_medicamento: getFieldVal("alergia_medicamento", "string"),
            possui_deficiencia: getFieldVal("possui_deficiencia", "string"),
            contato_medico: getFieldVal("contato_medico", "string")
        };

        // Alerta Console e visual do usuário para validações instantâneas de seu amigo da API
        console.warn("====[ SUPABASE PAYLOAD PRONTO ] ====");
        console.table(payload);
        
        alert("Enviado com Sucesso! Verifique seu *Console DevTools* (Aperte F12 na Guia Console) para ver o JSON final estruturado perfeitamente contendo os 'nulls', 'numbers' e 'booleans' gerados pela UI limpa!");
    });
});
