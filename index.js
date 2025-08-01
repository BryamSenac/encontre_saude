import { createMain } from "./main.js";
import { createBanner } from "./view/banner/banner.js";
import { createHeader } from "./view/header/header.js"

// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    createHeader() 
    createBanner()
    createMain()
});