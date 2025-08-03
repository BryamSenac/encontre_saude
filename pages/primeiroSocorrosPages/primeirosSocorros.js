import { createFooter } from "../../view/footer/footer.js";
import { createLogo } from "../../view/logo/logo.js";
import {createHeader} from "./../../view/header/header.js"
import { initPrimeirosSocorros } from "./JS/initPrimeirosSocorros.js";

// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    createHeader()
    createLogo()
    createFooter()
    initPrimeirosSocorros()
});