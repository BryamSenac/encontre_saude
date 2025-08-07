import { ROUTES } from "./../../config/routes/routes.js";

export function createHeader() {
    const header = document.getElementById("header");
    if (!header) return;

    // Cria o elemento <header>
    const headerEl = document.createElement("header");
    headerEl.className = "main-header";

    // ====== Barra fixa estreita ======
    const fixedBar = document.createElement("div");
    fixedBar.className = "fixed-bar";

    // 1) Botão hambúrguer
    const menuBtn = document.createElement("div");
    menuBtn.className = "menu-btn";
    menuBtn.id = "menuToggle";
    menuBtn.innerHTML = `<i class="fas fa-bars" id="menuIcon"></i>`;
    fixedBar.appendChild(menuBtn);

    // 2) Ícones de navegação (sempre visíveis)
    const navItems = [
        { text: "Home", icon: "fa-house", href: ROUTES.home },
        { text: "Primeiros Socorros", icon: "fa-kit-medical", href: ROUTES.primeirosSocorros },
        { text: "Ações Preventivas", icon: "fa-shield-heart", href: ROUTES.prevensao },
        { text: "Farmácias", icon: "fa-prescription-bottle-medical iconFarmacia", href: ROUTES.farmacia },
        { text: "Sintomas", icon: "fa-heart-pulse", href: ROUTES.sintomas },
    ];

    navItems.forEach(({ text, icon, href }) => {
        const a = document.createElement("a");
        a.href = href;
        a.className = "menu-item";
        a.innerHTML = `<i class="fas ${icon}"></i><span id="textHeader">${text}</span>`;
        fixedBar.appendChild(a);
    });

    // 3) Ícones de contato no final
    const contacts = document.createElement("div");
    contacts.id = "iconsContato";
    contacts.className = "contactsHeader";
    const contactItems = [
        { icon: "fa-brands fa-whatsapp", href: "https://wa.me/46991213122" },
        { icon: "fa-solid fa-phone", href: "tel:+5546991213122" },
        { icon: "fa-solid fa-envelope", href: "mailto:seuemail@gabrielwag971@gmail.com" },
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
    header.appendChild(headerEl);

    // ====== Lógica de Expansão ======
    let menuOpen = false;
    const menuIcon = document.getElementById("menuIcon");
    const spans = fixedBar.querySelectorAll(".menu-item span");

    function openMenu() {
        fixedBar.classList.add("expanded");
        menuIcon.classList.replace("fa-bars", "fa-xmark");
        spans.forEach(s => s.style.opacity = "1");
        menuOpen = true;
    }

    function closeMenu() {
        fixedBar.classList.remove("expanded");
        menuIcon.classList.replace("fa-xmark", "fa-bars");
        spans.forEach(s => s.style.opacity = "0");
        menuOpen = false;
    }

    // Toggle ao clicar no hambúrguer
    menuBtn.addEventListener("click", () => {
        menuOpen ? closeMenu() : openMenu();
    });

    // Inicializa com textos ocultos
    closeMenu();
}
