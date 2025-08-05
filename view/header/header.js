import { ROUTES } from "./../../config/routes/routes.js";

export function createHeader() {
    const header = document.getElementById("header");
    if (!header) return;

    const headerEl = document.createElement("header");
    headerEl.className = "main-header";

    // Barra fixa estreita
    const fixedBar = document.createElement("div");
    fixedBar.className = "fixed-bar";

    // Botão hamburguer (fixedBar)
    const menuBtn = document.createElement("div");
    menuBtn.className = "menu-btn";
    menuBtn.id = "menuToggle";
    menuBtn.innerHTML = `<i class="fas fa-bars" id="menuIcon"></i>`;
    fixedBar.appendChild(menuBtn);

    // Ícones + textos das páginas (fixedBar)
    const btnItems = [
        { text: "Home", icon: "fa-house", href: ROUTES.home },
        { text: "Primeiros Socorros", icon: "fa-kit-medical", href: ROUTES.primeirosSocorros },
        { text: "Ações Preventivas", icon: "fa-shield-heart", href: ROUTES.prevensao },
        { text: "Farmácias", icon: "fa-prescription-bottle-medical", href: ROUTES.farmacia },
        { text: "Sintomas", icon: "fa-heart-pulse", href: ROUTES.sintomas }
    ];

    btnItems.forEach(({ text, icon, href }) => {
        const a = document.createElement("a");
        a.href = href;
        a.className = "menu-item";
        a.innerHTML = `<i class="fas ${icon}"></i><span>${text}</span>`;
        fixedBar.appendChild(a);
    });

    // Ícones de contato (fixedBar)
    const contacts = document.createElement("div");
    contacts.className = "contacts";

    const contactItems = [
        { icon: "fa-brands fa-whatsapp", href: "https://wa.me/seuNumero" },
        { icon: "fa-solid fa-phone", href: "tel:+550000000000" },
        { icon: "fa-solid fa-envelope", href: "mailto:seuemail@dominio.com" }
    ];

    contactItems.forEach(({ icon, href }) => {
        const a = document.createElement("a");
        a.href = href;
        a.target = "_blank";
        a.innerHTML = `<i class="${icon}"></i>`;
        contacts.appendChild(a);
    });

    fixedBar.appendChild(contacts);

    headerEl.appendChild(fixedBar);

    // Sidebar expansível
    const sidebar = document.createElement("div");
    sidebar.className = "sidebar";
    sidebar.id = "sidebar";

    const menuList = document.createElement("ul");
    menuList.className = "menu";

    btnItems.forEach(({ text, icon, href }) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = href;
        a.innerHTML = `<i class="fas ${icon}"></i><span>${text}</span>`;
        li.appendChild(a);
        menuList.appendChild(li);
    });

    sidebar.appendChild(menuList);
    headerEl.appendChild(sidebar);
    header.appendChild(headerEl);

    let menuOpen = false;

    const menuIcon = document.getElementById("menuIcon");

    function openMenu() {
        sidebar.classList.add("open");
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-xmark");

        // Aparecer textos fixed-bar
        const spans = fixedBar.querySelectorAll(".menu-item span");
        spans.forEach(span => {
            span.style.opacity = "1";
        });

        menuOpen = true;
    }

    function closeMenu() {
        sidebar.classList.remove("open");
        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");

        // Ocultar textos fixed-bar
        const spans = fixedBar.querySelectorAll(".menu-item span");
        spans.forEach(span => {
            span.style.opacity = "0";
        });

        menuOpen = false;
    }

    menuBtn.addEventListener("click", () => {
        if (menuOpen) closeMenu();
        else openMenu();
    });

    // Opcional: inicia ocultando os textos fixed-bar
    closeMenu();
}
