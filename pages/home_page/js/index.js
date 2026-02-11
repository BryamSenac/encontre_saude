import { createMain } from "./main.js";
import { createSidebar } from "./../../../shared/sidebar.js";
import { createSintomasSection } from "./sintomas_ai/sintomas.js";

document.addEventListener("DOMContentLoaded", () => {
    createSidebar()
    try {
        createSintomasSection()
    } catch (e) {
        console.error("Error creating sintomas section:", e);
    }
    createMain()
});