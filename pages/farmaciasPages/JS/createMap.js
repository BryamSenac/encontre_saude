export function createMap() {

    let userLocation = null;

    const farmacias = [
        {
            nome: "Farmácia Municipal Cidade Norte",
            endereco: "Rua Taubaté, 370 - Bairro Pinheirinho",
            telefone: "(46) 3527-3522",
            site: null,
            instagram: null,
            horario: "Segunda a Sexta-feira: 08h às 12h / 13h30 às 16h",
            bairro: "Pinheirinho",
            lat: -26.046464848093784,
            lng: -53.06071936290148,
        },
        {
            nome: "Farmácia Municipal da Cango",
            endereco: "Rua Governador Parigot de Souza, 455 - Bairro Cango",
            telefone: "(46) 3523-6640",
            site: null,
            instagram: null,
            horario: "Segunda a Sexta-feira: 09h às 11h30 / 13h às 17h / 18h às 21h",
            bairro: "Cango",
            lat: -26.066262398082966,
            lng: -53.05257026742899
        },
        {
            nome: "Farmácia Municipal Cidade Sul",
            endereco: "Rua Sergipe, s/n - Bairro São Cristóvão",
            telefone: "(46) 3523-2441",
            site: null,
            instagram: null,
            horario: "Segunda a Sexta-feira: Turnos da manhã, tarde e noite",
            bairro: "São Cristóvão",
            lat: -26.088817577255902,
            lng: -53.047050074212294
        },
        {
            nome: "Farmácia Municipal Alvorada",
            endereco: "Rua Antônio Carneiro Neto, 623 - Bairro Alvorada",
            telefone: "(46) 3524-7342",
            site: null,
            instagram: null,
            horario: "Segunda a Sexta-feira: Horários diversos",
            bairro: "Alvorada",
            lat: -29.99529098050502,
            lng: -51.06962143354357
        },
        {
            nome: "Farmácia Municipal Cidade Leste",
            endereco: "Rua Octaviano Teixeira dos Santos, 1000 - Bairro Cidade Leste",
            telefone: "(46) 3523-2441",
            site: null,
            instagram: null,
            horario: "Segunda a Sexta-feira: Horários diversos",
            bairro: "Cidade Leste",
            lat: -26.0810,
            lng: -53.0605
        },
        {
            nome: "Farmácia Municipal Cidade Oeste",
            endereco: "Avenida Getúlio Vargas, 936 - Bairro São Miguel",
            telefone: "(46) 3523-6538",
            site: null,
            instagram: null,
            horario: "Segunda a Sexta-feira: Horários diversos",
            bairro: "São Miguel",
            lat: -26.0679,
            lng: -53.0739
        },
        {
            nome: "Farmácia UBS Alvorada",
            endereco: "Rua Antônio Carneiro Neto, s/n - Bairro Alvorada",
            telefone: "(46) 3524-4446",
            site: null,
            instagram: null,
            horario: "Segunda a Sexta-feira: Horários diversos",
            bairro: "Alvorada",
            lat: -26.0782152398228,
            lng: -53.06540942347807
        }
    ];

    const map = L.map('map').setView([-26.0815, -53.0556], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    let markers = [];

    function renderMarkers(lista) {
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        lista.forEach(farmacia => {
            const marker = L.marker([farmacia.lat, farmacia.lng])
                .addTo(map)
                .bindPopup(`<b>${farmacia.nome}</b><br>${farmacia.endereco}`);
            markers.push(marker);
        });
    }

    function abrirRota(lat, lng) {
        if (userLocation) {
            const { latitude, longitude } = userLocation;
            window.open(`https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lng}`, "_blank");
        } else {
            alert("Clique em 'Minha Localização' primeiro para habilitar sua posição.");
        }
    }

    function renderFarmaciasList(lista) {
        const container = document.getElementById("farmacias-list");
        container.innerHTML = "";
        lista.forEach(f => {
            const card = document.createElement("div");
            card.className = "card";

            // Conteúdo do card (sem onclick inline)
            card.innerHTML = `
        <h3>${f.nome}</h3>
        <p><strong>Endereço:</strong> ${f.endereco}</p>
        <p><strong>Telefone:</strong> ${f.telefone}</p>
        ${f.site ? `<p><a href="${f.site}" target="_blank">🌐 Site</a></p>` : ""}
        ${f.instagram ? `<p><a href="${f.instagram}" target="_blank">📸 Instagram</a></p>` : ""}
        <p><strong>Horário:</strong> ${f.horario}</p>
        <p><strong>Bairro:</strong> ${f.bairro}</p>
      `;

            // Botão de rota criado separadamente para poder adicionar evento sem conflito
            const rotaBtn = document.createElement("a");
            rotaBtn.className = "rota-btn";
            rotaBtn.href = "#";
            rotaBtn.textContent = "🧭 Ver Rota";
            rotaBtn.addEventListener("click", (e) => {
                e.preventDefault();
                abrirRota(f.lat, f.lng);
            });

            card.appendChild(rotaBtn);

            // Evento para focar o mapa ao clicar no card (mas sem interferir no botão "Ver Rota")
            card.addEventListener("click", (e) => {
                // Para evitar conflito com o clique do botão dentro do card
                if (e.target === rotaBtn) return;
                map.setView([f.lat, f.lng], 17);
            });

            container.appendChild(card);
        });
    }

    // Filtragem
    function filtrar() {
        const termo = document.getElementById("search").value.toLowerCase();
        const bairro = document.getElementById("bairro").value;
        const filtrados = farmacias.filter(f => {
            const matchNome = f.nome.toLowerCase().includes(termo);
            const matchBairro = bairro ? f.bairro === bairro : true;
            return matchNome && matchBairro;
        });
        renderMarkers(filtrados);
        renderFarmaciasList(filtrados);
    }

    document.getElementById("search").addEventListener("input", filtrar);
    document.getElementById("bairro").addEventListener("change", filtrar);

    // Sidebar toggle
    const sideebar = document.getElementById("sideebar");
    document.getElementById("menuBtn").addEventListener("click", () => {
        sideebar.classList.toggle("active");
    });

    // Localização do usuário
    document.getElementById("locBtn").addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                userLocation = pos.coords;
                map.setView([pos.coords.latitude, pos.coords.longitude], 16);
                L.marker([pos.coords.latitude, pos.coords.longitude])
                    .addTo(map)
                    .bindPopup("<b>Você está aqui!</b>").openPopup();
            }, () => {
                alert("Não foi possível acessar sua localização. Verifique as permissões do navegador.");
            });
        } else {
            alert("Seu navegador não suporta Geolocalização.");
        }
    });

    // Inicialização
    renderMarkers(farmacias);
    renderFarmaciasList(farmacias);
}
