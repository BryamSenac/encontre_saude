import { ROUTES } from "./../../config/routes/routes.js";

export function createHeader() {
    const header = document.getElementById("header");
    if (!header) return;

    // Header container
    const headerEl = document.createElement("header");
    headerEl.className = "main-header";

    // Sidebar (menu vertical)
    const sidebar = document.createElement("div");
    sidebar.className = "sidebar";

    // Botão hamburguer
    const menuWrapper = document.createElement("div");
    menuWrapper.className = "menu-wrapper";
    menuWrapper.id = "menuWrapper";

    const menuBtn = document.createElement("div");
    menuBtn.className = "menu-btn";
    menuBtn.id = "menuToggle";

    const menuIcon = document.createElement("i");
    menuIcon.className = "fas fa-bars";
    menuIcon.id = "menuIcon";

    menuBtn.appendChild(menuIcon);
    menuWrapper.appendChild(menuBtn);

    // Barra vertical atrás do menu (barra colorida)
    const menuBar = document.createElement("div");
    menuBar.className = "menu-bar";

    // Lista do menu
    const menuList = document.createElement("ul");
    menuList.className = "menu";
    menuList.id = "menuItems";

    // Botões do menu com rotas atuais
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

    // Adiciona os elementos na ordem correta
    sidebar.appendChild(menuWrapper);
    sidebar.appendChild(menuBar);
    sidebar.appendChild(menuList);

    // Fundo para fechar menu ao clicar fora
    const menuBackground = document.createElement("div");
    menuBackground.className = "menu-background";
    menuBackground.id = "menuBackground";

    headerEl.appendChild(sidebar);
    headerEl.appendChild(menuBackground);
    header.appendChild(headerEl);

    // Estado do menu
    let menuOpen = false;

    function openMenu() {
        menuList.classList.add("open");
        menuBar.classList.add("open");   // mostra a barra
        menuBackground.classList.add("open");
        menuBtn.classList.add("open");
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-xmark");
        menuOpen = true;
    }

    function closeMenu() {
        menuList.classList.remove("open");
        menuBar.classList.remove("open");  // esconde a barra
        menuBackground.classList.remove("open");
        menuBtn.classList.remove("open");
        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");
        menuOpen = false;
    }

    // Toggle menu ao clicar no botão hamburguer
    menuWrapper.addEventListener("click", () => {
        if (menuOpen) closeMenu();
        else openMenu();
    });

    // Fecha menu clicando fora
    menuBackground.addEventListener("click", () => {
        closeMenu();
    });
}
