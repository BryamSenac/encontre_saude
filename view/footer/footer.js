export function createFooter() {
    const container = document.getElementById("footer");

    const footer = document.createElement("footer");

    const divFooter = document.createElement("div");
    divFooter.classList.add("footerSize");

    const img = document.createElement("img");
    img.classList.add("logoTipo");
    img.src = "/assets/logoTipo.png";
    img.alt = "logoTipo";

    const contacts = document.createElement("div");
    contacts.classList.add("contacts");

    // contatos
    const contactItems = [
        { icon: "fas fa-envelope", tooltip: "contato@saude.com" },
        { icon: "fas fa-phone", tooltip: "(99) 9999-9999" },
        { icon: "fab fa-whatsapp", tooltip: "(99) 98888-8888" }
    ];

    contactItems.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("contact-item");
        div.dataset.tooltip = item.tooltip;

        const icon = document.createElement("i");
        item.icon.split(" ").forEach(cls => icon.classList.add(cls));

        div.appendChild(icon);
        contacts.appendChild(div);
    });

    divFooter.appendChild(img);
    divFooter.appendChild(contacts);
    footer.appendChild(divFooter);
    container.appendChild(footer);
}