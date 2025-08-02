import { createMain } from "./main.js";
import { createBanner } from "./view/banner/banner.js";
import { createFooter } from "./view/footer/footer.js";
import { createHeader } from "./view/header/header.js"
import { createLogo } from "./view/logo/logo.js";

// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    createHeader() 
    createBanner()
    createMain()
    createLogo()
    createFooter()
});