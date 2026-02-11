
import { createSidebar } from "./../../shared/sidebar.js";
import { infoPrevencao } from "./js/info_prevencao.js";

// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    createSidebar()

    infoPrevencao()
});