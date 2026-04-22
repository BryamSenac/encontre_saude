import { ROUTES } from "../config/routes/routes.js";
import { createTelegramWidget } from "./telegram_widget.js";
import { authService } from "../Services/authService.js";

export function createSidebar() {
    const header = document.getElementById("header");
    if (!header) return;

    const sidebar = document.createElement("nav");
    sidebar.className = "sidebar";

    const logoContainer = document.createElement("div");
    logoContainer.className = "sidebar-logo";
    const logoImg = document.createElement("img");
    logoImg.src = "/assets/logoTipo.png";
    logoImg.alt = "Encontre Saúde Logo";
    logoContainer.appendChild(logoImg);
    sidebar.appendChild(logoContainer);

    const navList = document.createElement("div");
    navList.className = "sidebar-nav";
    sidebar.appendChild(navList);

    const baseNavItems = [
        { text: "Home", icon: "fa-house", href: ROUTES.home },
        { text: "Primeiros Socorros", icon: "fa-kit-medical", href: ROUTES.primeirosSocorros },
        { text: "Ações Preventivas", icon: "fa-shield-heart", href: ROUTES.prevensao },
        { text: "Farmácias", icon: "fa-prescription-bottle-medical", href: ROUTES.farmacia },
        { text: "Pré-Prontuário", icon: "fa-file-medical", href: ROUTES.preProntuario },
    ];

    const updateNavItems = async () => {
        const { session } = await authService.getUserSession();
        
        const currentItems = [...baseNavItems];
        if (session) {
            currentItems.push({ text: "Meu Perfil", icon: "fa-user", href: ROUTES.perfil });
            currentItems.push({ text: "Sair", icon: "fa-arrow-right-from-bracket", href: "#", id: "btnLogoutSidebar" });
        } else {
            currentItems.push({ text: "Login / Cadastro", icon: "fa-arrow-right-to-bracket", href: ROUTES.login });
        }

        navList.innerHTML = "";
        currentItems.forEach(({ text, icon, href, id }) => {
            const a = document.createElement("a");
            a.href = href;
            if (id) a.id = id;
            a.className = "nav-item";
            a.innerHTML = `
                <i class="fas ${icon} nav-icon"></i>
                <span class="nav-text">${text}</span>
            `;
            
            if (id === "btnLogoutSidebar") {
                a.addEventListener("click", async (e) => {
                    e.preventDefault();
                    if (confirm("Deseja realmente sair?")) {
                        await authService.signOut();
                        localStorage.removeItem("isLoggedIn");
                        window.location.href = ROUTES.home;
                    }
                });
            }

            // Mobile close on click
            a.addEventListener("click", () => {
                if (window.innerWidth <= 768 && !id) {
                    toggleSidebar();
                }
            });

            navList.appendChild(a);
        });
    };

    // Initial render
    updateNavItems();

    // Listen for auth changes
    authService.onAuthStateChange((event, session) => {
        if (session) {
            localStorage.setItem("isLoggedIn", "true");
        } else {
            localStorage.removeItem("isLoggedIn");
        }
        updateNavItems();
    });

    const footerContacts = document.createElement("div");
    footerContacts.className = "sidebar-footer";

    const contactItems = [
        { icon: "fa-brands fa-whatsapp", href: "https://wa.me/46991213122" },
        { icon: "fa-solid fa-phone", href: "tel:+5546991213122" },
        { icon: "fa-solid fa-envelope", href: "mailto:seuemail@gabrielwag971@gmail.com" },
    ];

    contactItems.forEach(({ icon, href }) => {
        const a = document.createElement("a");
        a.href = href;
        a.target = "_blank";
        a.className = "contact-icon";
        a.innerHTML = `<i class="${icon}"></i>`;
        footerContacts.appendChild(a);
    });
    sidebar.appendChild(footerContacts);

    // Mobile Toggle
    const mobileToggle = document.createElement("button");
    mobileToggle.className = "mobile-menu-toggle";
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(mobileToggle);

    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    function toggleSidebar() {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
        mobileToggle.innerHTML = sidebar.classList.contains("active")
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    }

    mobileToggle.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);

    document.body.prepend(sidebar);
    document.body.classList.add("with-sidebar");
    createTelegramWidget();
}
