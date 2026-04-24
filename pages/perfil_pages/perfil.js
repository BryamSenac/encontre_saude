import { createSidebar } from "../../shared/sidebar.js";
import { createFooter } from "../../shared/footer.js";
import { ROUTES } from "../../config/routes/routes.js";
import { authService } from "../../Services/authService.js";
import { profileService } from "../../Services/profileService.js";
import { chatService } from "../../Services/chatService.js";

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Auth Guard: Validar sessão com Supabase
    const { session, user } = await authService.getUserSession();
    
    if (!session) {
        window.location.href = ROUTES.login;
        return;
    }

    // Esconde o "flicker" inicial
    const container = document.querySelector(".perfil-container");
    if (container) container.style.opacity = "1";

    // 2. Atualizar informações básicas no cabeçalho
    const viewNomeTitulo = document.getElementById("viewNomeTitulo");
    const displayEmail = document.getElementById("displayEmail");

    if (user) {
        const nomeUsuario = user.user_metadata?.full_name || user.user_metadata?.name || "Paciente";
        if (viewNomeTitulo) viewNomeTitulo.textContent = nomeUsuario;
        if (displayEmail) displayEmail.textContent = user.email;
    }

    // 3. Inicializar componentes comuns
    createSidebar();
    createFooter();

    // =============================================
    // ESTADO E REFERÊNCIAS
    // =============================================
    const viewMode = document.getElementById("viewMode");
    const perfilForm = document.getElementById("perfilForm");
    const btnEditSaude = document.getElementById("btnEditSaude");
    const btnCancelEdit = document.getElementById("btnCancelEdit");

    let dadosSaude = null;
    let sessoesHistoricoCache = [];

    // =============================================
    // HELPERS DE FORMATAÇÃO
    // =============================================
    const formatarValor = (val, sufixo = "") => {
        if (val === null || val === undefined || val === "" || (Array.isArray(val) && val.length === 0)) {
            return "Não Informado";
        }
        return `${val}${sufixo}`;
    };

    const formatarBooleano = (val) => {
        if (val === true || val === "true") return "Sim";
        if (val === false || val === "false") return "Não";
        return "Não Informado";
    };

    // =============================================
    // LÓGICA DE DADOS DO PERFIL
    // =============================================
    const carregarDadosIniciais = async () => {
        const { profile, error } = await profileService.getProfile();
        if (!error && profile) {
            dadosSaude = profile;
            atualizarModoVisualizacao();
        }
    };

    const atualizarModoVisualizacao = () => {
        if (!dadosSaude) return;

        const mapeamento = {
            "view-idade": formatarValor(dadosSaude.idade, " anos"),
            "view-peso": formatarValor(dadosSaude.peso, " kg"),
            "view-altura": formatarValor(dadosSaude.altura, " m"),
            "view-sexo": formatarValor(dadosSaude.sexo),
            "view-fuma": formatarBooleano(dadosSaude.fuma),
            "view-bebe": formatarBooleano(dadosSaude.bebe),
            "view-alergia": formatarBooleano(dadosSaude.alergia_medicamento) !== "Não Informado" ? dadosSaude.alergia_medicamento : "Não Informado",
            "view-deficiencia": formatarValor(dadosSaude.possui_deficiencia),
            "view-contato-nome": formatarValor(dadosSaude.contato_medico_nome),
            "view-contato-email": formatarValor(dadosSaude.contato_medico_email),
            "view-contato-telefone": formatarValor(dadosSaude.contato_medico_telefone)
        };

        // Correção para exibir "Sim/Não" se for booleano, ou o texto se for preenchido
        if (typeof dadosSaude.alergia_medicamento === 'boolean') {
             mapeamento["view-alergia"] = formatarBooleano(dadosSaude.alergia_medicamento);
        }

        for (const [id, valor] of Object.entries(mapeamento)) {
            const el = document.getElementById(id);
            if (el) el.textContent = valor;
        }
    };

    const preencherFormulario = () => {
        if (!dadosSaude) return;

        const campos = [
            "idade", "peso", "altura", "sexo", 
            "alergia_medicamento", "possui_deficiencia", 
            "contato_medico_nome", "contato_medico_email", "contato_medico_telefone"
        ];

        campos.forEach(id => {
            const el = document.getElementById(id);
            if (el && dadosSaude[id] !== undefined && dadosSaude[id] !== null) {
                el.value = dadosSaude[id];
            }
        });

        // Radios (Fuma/Bebe)
        ["fuma", "bebe"].forEach(name => {
            const val = dadosSaude[name]?.toString();
            if (val) {
                const radio = document.querySelector(`input[name="${name}"][value="${val}"]`);
                if (radio) radio.checked = true;
            }
        });
    };

    // =============================================
    // HISTÓRICO DE CONSULTAS IA
    // =============================================
    const renderizarHistoricoPerfil = async () => {
        const lista = document.getElementById("perfil-historico-lista");
        if (!lista) return;

        const { history, error } = await chatService.getUserHistory();
        lista.innerHTML = "";
        sessoesHistoricoCache = history || [];

        if (error || sessoesHistoricoCache.length === 0) {
            lista.innerHTML = `
                <div class="perfil-historico-vazio">
                    <i class="fas fa-comment-medical"></i>
                    <p>Nenhuma consulta registrada.</p>
                    <small>Suas conversas com a IA de sintomas aparecerão aqui.</small>
                </div>
            `;
            return;
        }

        sessoesHistoricoCache.forEach((sessao, index) => {
            const item = document.createElement("div");
            item.className = "perfil-historico-item";
            const dataFormatada = new Date(sessao.created_at).toLocaleString("pt-BR");

            item.innerHTML = `
                <div class="perfil-historico-item__data">
                    <i class="fas fa-calendar-alt"></i> ${dataFormatada}
                </div>
                <div class="perfil-historico-item__row">
                    <span class="perfil-historico-badge perfil-historico-badge--user">Você</span>
                    <p>${sessao.descricao_usuario}</p>
                </div>
                <div class="perfil-historico-item__row">
                    <span class="perfil-historico-badge perfil-historico-badge--ai">IA</span>
                    <p>${sessao.resposta_ia}</p>
                </div>
                <button class="btn-detalhes-ia" data-index="${index}">
                    <i class="fas fa-expand-alt"></i> Ver detalhes
                </button>
            `;
            lista.appendChild(item);
        });
    };

    // =============================================
    // MODAL DE DETALHES
    // =============================================
    const modalHistorico = document.getElementById("modal-historico");
    const closeModalHistorico = document.getElementById("closeModalHistorico");

    const abrirModalHistorico = (dados) => {
        if (!modalHistorico) return;
        document.getElementById("modal-data").textContent = new Date(dados.created_at).toLocaleString("pt-BR");
        document.getElementById("modal-usuario").textContent = dados.descricao_usuario;
        document.getElementById("modal-ia").textContent = dados.resposta_ia;
        modalHistorico.classList.add("show");
        document.body.style.overflow = "hidden";
    };

    const fecharModalHistorico = () => {
        modalHistorico.classList.remove("show");
        document.body.style.overflow = "";
    };

    closeModalHistorico?.addEventListener("click", fecharModalHistorico);
    window.addEventListener("click", (e) => {
        if (e.target === modalHistorico) fecharModalHistorico();
    });

    document.getElementById("perfil-historico-lista")?.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-detalhes-ia");
        if (btn) {
            const idx = btn.getAttribute("data-index");
            if (sessoesHistoricoCache[idx]) abrirModalHistorico(sessoesHistoricoCache[idx]);
        }
    });

    // =============================================
    // EVENTOS DE NAVEGAÇÃO E MODOS
    // =============================================
    btnEditSaude?.addEventListener("click", () => {
        preencherFormulario();
        viewMode.style.display = "none";
        perfilForm.style.display = "block";
    });

    btnCancelEdit?.addEventListener("click", () => {
        perfilForm.style.display = "none";
        viewMode.style.display = "block";
    });

    const btnVerHistorico = document.getElementById("btn-ver-historico");
    btnVerHistorico?.addEventListener("click", () => {
        const listaHistorico = document.getElementById("perfil-historico-lista");
        const estaOculto = listaHistorico.classList.contains("perfil-historico-lista--oculto");

        if (estaOculto) {
            listaHistorico.classList.remove("perfil-historico-lista--oculto");
            btnVerHistorico.querySelector("span").textContent = "Ocultar histórico";
            btnVerHistorico.querySelector("i").className = "fas fa-chevron-up";
        } else {
            listaHistorico.classList.add("perfil-historico-lista--oculto");
            btnVerHistorico.querySelector("span").textContent = "Ver mais";
            btnVerHistorico.querySelector("i").className = "fas fa-chevron-down";
        }
    });

    // =============================================
    // LOGOUT
    // =============================================
    const handleLogout = async () => {
        await authService.signOut();
        window.location.href = ROUTES.home;
    };
    document.getElementById("btnLogout")?.addEventListener("click", handleLogout);
    document.getElementById("btnLogoutForm")?.addEventListener("click", handleLogout);

    // =============================================
    // SUBMIT FORMULÁRIO
    // =============================================
    perfilForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btnSave = perfilForm.querySelector('button[type="submit"]');
        const originalText = btnSave.textContent;
        btnSave.disabled = true;
        btnSave.textContent = "Salvando...";

        const getFieldVal = (id, type) => {
            const el = document.getElementById(id);
            if (!el) return null;
            const val = el.value.trim();
            if (val === "") return null;
            return type === "number" ? Number(val) : val;
        };

        const payload = {
            sexo: getFieldVal("sexo", "string"),
            idade: getFieldVal("idade", "number"),
            peso: getFieldVal("peso", "number"),
            altura: getFieldVal("altura", "number"),
            fuma: document.querySelector('input[name="fuma"]:checked')?.value === "true",
            bebe: document.querySelector('input[name="bebe"]:checked')?.value === "true",
            alergia_medicamento: getFieldVal("alergia_medicamento", "string"),
            possui_deficiencia: getFieldVal("possui_deficiencia", "string"),
            contato_medico_nome: getFieldVal("contato_medico_nome", "string"),
            contato_medico_email: getFieldVal("contato_medico_email", "string"),
            contato_medico_telefone: getFieldVal("contato_medico_telefone", "string"),
        };

        const { profile, error } = await profileService.saveProfile(payload);
        
        btnSave.disabled = false;
        btnSave.textContent = originalText;

        if (error) {
            alert("Erro ao salvar: " + error.message);
        } else {
            dadosSaude = profile;
            perfilForm.style.display = "none";
            viewMode.style.display = "block";
            atualizarModoVisualizacao();
        }
    });

    // =============================================
    // CARGA INICIAL
    // =============================================
    carregarDadosIniciais();
    renderizarHistoricoPerfil();
});
