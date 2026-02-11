import { createFarmacias } from "./create_farmacias.js";

export function createMap() {

    const farmacias = createFarmacias()

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

            // Evento ao clicar no marcador
            marker.on('click', () => {
                // Abrir sidebar se estiver fechada
                if (!sideebar.classList.contains("active")) {
                    sideebar.classList.add("active");
                }

                // Destacar o card correspondente
                const cardId = "card-" + farmacia.nome.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                const card = document.getElementById(cardId);

                if (card) {
                    // Remove destaque anterior
                    document.querySelectorAll('.card.active').forEach(c => c.classList.remove('active'));
                    // Adiciona destaque no card clicado
                    card.classList.add('active');

                    // Scroll para o card na lista
                    card.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });

            markers.push(marker);
        });
    }

    function renderFarmaciasList(lista) {
        const container = document.getElementById("farmacias-list");
        container.innerHTML = "";
        lista.forEach(f => {
            const card = document.createElement("div");
            card.className = "card";
            // id baseado no nome da farmácia, removendo espaços e caracteres especiais simples
            card.id = "card-" + f.nome.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

            card.innerHTML = `
            <h3>${f.nome}</h3>
            <p><strong>Endereço:</strong> ${f.endereco}</p>
            <p><strong>Telefone:</strong> ${f.telefone}</p>
            ${f.site ? `<p><a href="${f.site}" target="_blank">🌐 Site</a></p>` : ""}
            ${f.instagram ? `<p><a href="${f.instagram}" target="_blank">📸 Instagram</a></p>` : ""}
            <p><strong>Horário:</strong> ${f.horario}</p>
            <p><strong>Bairro:</strong> ${f.bairro}</p>
        `;
            function abrirRota(lat, lng) {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(url, '_blank');
            }
            // Botão rota
            const rotaBtn = document.createElement("a");
            rotaBtn.className = "rota-btn";
            rotaBtn.href = "#";
            rotaBtn.textContent = "🧭 Ver Rota";
            rotaBtn.addEventListener("click", (e) => {
                e.preventDefault();
                abrirRota(f.lat, f.lng);
            });

            card.appendChild(rotaBtn);

            card.addEventListener("click", (e) => {
                if (e.target === rotaBtn) return;
                map.setView([f.lat, f.lng], 17);
            });

            container.appendChild(card);
        });
    }

    // Filtragem
    let tipoFiltro = {
        municipal: true,
        privada: true,
    };

    function filtrar() {
        const termo = document.getElementById("search").value.toLowerCase();
        const bairro = document.getElementById("bairro").value;

        const filtrados = farmacias.filter(f => {
            const matchNome = f.nome.toLowerCase().includes(termo);
            const matchBairro = bairro ? f.bairro === bairro : true;
            const matchTipo = tipoFiltro[f.tipo?.toLowerCase()]; // ← safe

            return matchNome && matchBairro && matchTipo;
        });

        renderMarkers(filtrados);
        renderFarmaciasList(filtrados);
    }

    document.getElementById("search").addEventListener("input", filtrar);
    document.getElementById("bairro").addEventListener("change", filtrar);

    document.getElementById("btnMunicipal").addEventListener("click", () => {
        tipoFiltro.municipal = !tipoFiltro.municipal;
        document.getElementById("btnMunicipal").classList.toggle("active", tipoFiltro.municipal);
        filtrar();
    });

    document.getElementById("btnPrivada").addEventListener("click", () => {
        tipoFiltro.privada = !tipoFiltro.privada;
        document.getElementById("btnPrivada").classList.toggle("active", tipoFiltro.privada);
        filtrar();
    });
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
