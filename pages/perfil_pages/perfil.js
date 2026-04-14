import { createSidebar } from "../../shared/sidebar.js";
import { createFooter } from "../../shared/footer.js";
import { ROUTES } from "../../config/routes/routes.js";
import { carregarHistorico } from "../home_page/js/sintomas_ai/api.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Auth Guard (Simulado para que colegas continuem testando fluxo de bloqueios)
    if (!localStorage.getItem("isLoggedIn")) {
        window.location.href = ROUTES.login;
        return;
    }

    createSidebar();
    createFooter();

    // =============================================
    // REFERÊNCIAS DOS DOIS MODOS
    // =============================================
    const viewMode   = document.getElementById("viewMode");
    const perfilForm = document.getElementById("perfilForm");

    // Botões de alternância de modo
    const btnEditSaude  = document.getElementById("btnEditSaude");
    const btnCancelEdit = document.getElementById("btnCancelEdit");

    // Campos de texto no modo visualização
    const viewIdade      = document.getElementById("view-idade");
    const viewPeso       = document.getElementById("view-peso");
    const viewAltura     = document.getElementById("view-altura");
    const viewSexo       = document.getElementById("view-sexo");
    const viewFuma       = document.getElementById("view-fuma");
    const viewBebe       = document.getElementById("view-bebe");
    const viewAlergia    = document.getElementById("view-alergia");
    const viewDeficiencia = document.getElementById("view-deficiencia");
    const viewContato    = document.getElementById("view-contato");

    // =============================================
    // HELPER: formata valor para exibição em texto
    // =============================================
    const formatarValor = (val, sufixo = "") => {
        if (val === null || val === undefined || val === "") return "Há Prencher";
        return `${val}${sufixo}`;
    };

    const formatarBooleano = (val) => {
        if (val === true || val === "true") return "Sim";
        if (val === false || val === "false") return "Não";
        return "Há Prencher";
    };

    // =============================================
    // ESTADO LOCAL: dados de saúde salvos
    // =============================================
    let dadosSaude = JSON.parse(localStorage.getItem("dadosSaude") || "null");

    // =============================================
    // POPULA O MODO VISUALIZAÇÃO com os dados
    // =============================================
    const atualizarModoVisualizacao = () => {
        if (!dadosSaude) return;

        viewIdade.textContent       = formatarValor(dadosSaude.idade, " anos");
        viewPeso.textContent        = formatarValor(dadosSaude.peso, " kg");
        viewAltura.textContent      = formatarValor(dadosSaude.altura, " m");
        viewSexo.textContent        = formatarValor(dadosSaude.sexo);
        viewFuma.textContent        = formatarBooleano(dadosSaude.fuma);
        viewBebe.textContent        = formatarBooleano(dadosSaude.bebe);
        viewAlergia.textContent     = formatarValor(dadosSaude.alergia_medicamento);
        viewDeficiencia.textContent = formatarValor(dadosSaude.possui_deficiencia);
        viewContato.textContent     = formatarValor(dadosSaude.contato_medico);
    };

    // =============================================
    // POPULA O FORMULÁRIO com os dados existentes
    // =============================================
    const preencherFormulario = () => {
        if (!dadosSaude) return;

        if (dadosSaude.idade)    document.getElementById("idade").value    = dadosSaude.idade;
        if (dadosSaude.peso)     document.getElementById("peso").value     = dadosSaude.peso;
        if (dadosSaude.altura)   document.getElementById("altura").value   = dadosSaude.altura;
        if (dadosSaude.sexo)     document.getElementById("sexo").value     = dadosSaude.sexo;

        if (dadosSaude.alergia_medicamento) document.getElementById("alergia_medicamento").value = dadosSaude.alergia_medicamento;
        if (dadosSaude.possui_deficiencia)  document.getElementById("possui_deficiencia").value  = dadosSaude.possui_deficiencia;
        if (dadosSaude.contato_medico)      document.getElementById("contato_medico").value      = dadosSaude.contato_medico;

        // Radios
        const fumaVal = dadosSaude.fuma?.toString();
        if (fumaVal) {
            const fumaRadio = document.querySelector(`input[name="fuma"][value="${fumaVal}"]`);
            if (fumaRadio) fumaRadio.checked = true;
        }

        const bebeVal = dadosSaude.bebe?.toString();
        if (bebeVal) {
            const bebeRadio = document.querySelector(`input[name="bebe"][value="${bebeVal}"]`);
            if (bebeRadio) bebeRadio.checked = true;
        }
    };

    // Carrega os dados ao iniciar
    atualizarModoVisualizacao();

    // =============================================
    // HISTÓRICO DE CONVERSAS DA IA NO PERFIL
    // =============================================
    const renderizarHistoricoPerfil = () => {
        const lista = document.getElementById("perfil-historico-lista");
        if (!lista) return;

        const historico = carregarHistorico();
        lista.innerHTML = "";

        if (historico.length === 0) {
            lista.innerHTML = `
                <div class="perfil-historico-vazio">
                    <i class="fas fa-comment-medical"></i>
                    <p>Nenhuma consulta registrada.</p>
                    <small>Suas conversas com a IA de sintomas aparecerão aqui.</small>
                </div>
            `;
            return;
        }

        historico.forEach((sessao) => {
            const item = document.createElement("div");
            item.className = "perfil-historico-item";

            const userMsg = sessao.mensagens.find(m => m.tipo === "user");
            const aiMsg   = sessao.mensagens.find(m => m.tipo === "ai");

            item.innerHTML = `
                <div class="perfil-historico-item__data">
                    <i class="fas fa-calendar-alt"></i> ${sessao.data}
                </div>
                ${userMsg ? `
                <div class="perfil-historico-item__row">
                    <span class="perfil-historico-badge perfil-historico-badge--user">Você</span>
                    <p>${userMsg.texto}</p>
                </div>` : ''}
                ${aiMsg ? `
                <div class="perfil-historico-item__row">
                    <span class="perfil-historico-badge perfil-historico-badge--ai">IA</span>
                    <p>${aiMsg.texto}</p>
                </div>` : ''}
            `;

            lista.appendChild(item);
        });
    };

    renderizarHistoricoPerfil();

    // Toggle "Ver mais / Ocultar" do histórico no perfil
    const btnVerHistorico = document.getElementById("btn-ver-historico");
    const listaHistorico  = document.getElementById("perfil-historico-lista");

    if (btnVerHistorico && listaHistorico) {
        btnVerHistorico.addEventListener("click", () => {
            const aberto = !listaHistorico.classList.contains("perfil-historico-lista--oculto");

            if (aberto) {
                listaHistorico.classList.add("perfil-historico-lista--oculto");
                btnVerHistorico.querySelector("span").textContent = "Ver mais";
                btnVerHistorico.querySelector("i").style.transform = "rotate(0deg)";
            } else {
                listaHistorico.classList.remove("perfil-historico-lista--oculto");
                btnVerHistorico.querySelector("span").textContent = "Ocultar";
                btnVerHistorico.querySelector("i").style.transform = "rotate(180deg)";
            }
        });
    }

    // =============================================
    // ALTERNÂNCIA: Visualização → Edição
    // =============================================
    btnEditSaude.addEventListener("click", () => {
        preencherFormulario();
        viewMode.style.display   = "none";
        perfilForm.style.display = "block";
    });

    // =============================================
    // ALTERNÂNCIA: Edição → Visualização (cancelar)
    // =============================================
    btnCancelEdit.addEventListener("click", () => {
        perfilForm.style.display = "none";
        viewMode.style.display   = "block";
    });

    // =============================================
    // SISTEMA DE LOGOUT (botão nas duas views)
    // =============================================
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        window.location.href = ROUTES.home;
    };

    document.getElementById("btnLogout")?.addEventListener("click", handleLogout);
    document.getElementById("btnLogoutForm")?.addEventListener("click", handleLogout);

    // =============================================
    // SUBMIT DO FORMULÁRIO
    // =============================================
    const getFieldVal = (id, type) => {
        const rawVal = document.getElementById(id).value.trim();
        if (rawVal === "") return null;
        if (type === "number") return Number(rawVal);
        return rawVal;
    };

    perfilForm.addEventListener("submit", (e) => {
        e.preventDefault();

        /*
         * ENGINE DO SUPABASE:
         * Campos vazios (Strings sem conteudo, length == 0) devem ser submetidos
         * estritamente como NULL para o banco para ele lidar com o Update de row perfeitamente.
         * Nomes e variáveis escritas exatamente nos tipos (typeof) requisitados.
         */
        const payload = {
            id_usuario:           "123e4567-e89b-12d3-a456-426614174000", /* Exemplo Padrão UUID Supabase Auth.uid()*/
            sexo:                 getFieldVal("sexo", "string"),
            idade:                getFieldVal("idade", "number"),
            peso:                 getFieldVal("peso", "number"),
            altura:               getFieldVal("altura", "number"),
            fuma:                 document.querySelector('input[name="fuma"]:checked').value === "true",
            bebe:                 document.querySelector('input[name="bebe"]:checked').value === "true",
            alergia_medicamento:  getFieldVal("alergia_medicamento", "string"),
            possui_deficiencia:   getFieldVal("possui_deficiencia", "string"),
            contato_medico:       getFieldVal("contato_medico", "string")
        };

        // Salva localmente para persistir entre sessões (simulação)
        dadosSaude = payload;
        localStorage.setItem("dadosSaude", JSON.stringify(dadosSaude));

        // Volta para o modo visualização e atualiza os textos
        perfilForm.style.display = "none";
        viewMode.style.display   = "block";
        atualizarModoVisualizacao();

        // Log para validação da API
        console.warn("====[ SUPABASE PAYLOAD PRONTO ] ====");
        console.table(payload);
    });
});
