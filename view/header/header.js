import { ROUTES } from "./../../config/routes/routes.js";

export function createHeader() {
    const header = document.getElementById("header");
    if (!header) return;

    const headerEl = document.createElement("header");
    headerEl.className = "main-header";

    // Botão hamburguer
    const menuBtn = document.createElement("div");
    menuBtn.className = "menu-btn";
    menuBtn.id = "menuToggle";

    const menuIcon = document.createElement("i");
    menuIcon.className = "fas fa-bars";
    menuIcon.id = "menuIcon";

    menuBtn.appendChild(menuIcon);
    headerEl.appendChild(menuBtn);

    // Navbar lateral
    const sidebar = document.createElement("div");
    sidebar.className = "sidebar";
    sidebar.id = "sidebar";

    const menuList = document.createElement("ul");
    menuList.className = "menu";

    const btnItems = [
        { text: "Home", icon: "fa-house", href: ROUTES.home },
        { text: "Primeiros Socorros", icon: "fa-kit-medical", href: ROUTES.primeirosSocorros },
        { text: "Ações Preventivas", icon: "fa-shield-heart", href: ROUTES.prevensao },
        { text: "Farmácias", icon: "fa-prescription-bottle-medical", href: ROUTES.farmacia },
        { text: "Sintomas", icon: "fa-heart-pulse", href: ROUTES.sintomas }
    ];

    btnItems.forEach(({ text, icon, href }) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = href;

        const i = document.createElement("i");
        i.className = `fas ${icon}`;

        const span = document.createElement("span");
        span.textContent = text;

        a.appendChild(i);
        a.appendChild(span);
        li.appendChild(a);
        menuList.appendChild(li);
    });

    sidebar.appendChild(menuList);
    headerEl.appendChild(sidebar);
    header.appendChild(headerEl);

    // Estado do menu
    let menuOpen = false;

    function openMenu() {
        sidebar.classList.add("open");
        menuBtn.classList.add("open");
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-xmark");
        menuOpen = true;
    }

    function closeMenu() {
        sidebar.classList.remove("open");
        menuBtn.classList.remove("open");
        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");
        menuOpen = false;
    }

    menuBtn.addEventListener("click", () => {
        if (menuOpen) closeMenu();
        else openMenu();
    });
}
