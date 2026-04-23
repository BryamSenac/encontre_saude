import { createSidebar } from "../../shared/sidebar.js";
import { createFooter } from "../../shared/footer.js";
import { ROUTES } from "../../config/routes/routes.js";
import { authService } from "../../Services/authService.js";
import { carregarHistorico } from "../home_page/js/sintomas_ai/api.js";
import { profileService } from "../../Services/profileService.js"; 
import { chatService } from "../../Services/chatService.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Esconde o container principal até validar a sessão para evitar "flicker"
    const container = document.querySelector(".perfil-container");
    if (container) container.style.opacity = "0";

    // 1. Auth Guard Real usando Supabase
    const { session, user } = await authService.getUserSession();
    
    if (!session) {
        window.location.href = ROUTES.login;
        return;
    }

    // Mostra o container agora que sabemos que o usuário está logado
    if (container) container.style.opacity = "1";

    // Atualiza o nome/email do usuário logado
    const displayNome = document.getElementById("displayNome");
    if (displayNome && user) {
        const nomeUsuario = user.user_metadata?.full_name || user.user_metadata?.name || user.email;
        displayNome.textContent = nomeUsuario;
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
        if (val === null || val === undefined || val === "" || (Array.isArray(val) && val.length === 0)) return "Não Informado";
        return `${val}${sufixo}`;
    };

    const formatarBooleano = (val) => {
        if (val === true || val === "true") return "Sim";
        if (val === false || val === "false") return "Não";
        return "Não Informado";
    };

    // =============================================
    // ESTADO LOCAL: dados de saúde
    // =============================================
    let dadosSaude = null;

    // Busca dados iniciais do Supabase
    const carregarDadosIniciais = async () => {
        const { profile, error } = await profileService.getProfile();
        if (!error && profile) {
            dadosSaude = profile;
            atualizarModoVisualizacao();
        }
    };

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
        
        // Conversão para exibição amigável dos tipos do banco
        viewAlergia.textContent     = formatarBooleano(dadosSaude.alergia_medicamento);
        viewDeficiencia.textContent = Array.isArray(dadosSaude.possui_deficiencia) 
                                      ? formatarValor(dadosSaude.possui_deficiencia.join(", ")) 
                                      : formatarValor(dadosSaude.possui_deficiencia);
        viewContato.textContent     = formatarValor(dadosSaude.contato_medico_particular);
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

        // Note: para alergia no formulário, se for booleano no banco mas texto na UI, 
        // aqui você pode decidir como preencher. Se quiser manter texto local, use localStorage como cache.
        if (dadosSaude.contato_medico_particular) {
            document.getElementById("contato_medico").value = dadosSaude.contato_medico_particular;
        }

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

    // Carrega do banco ao iniciar
    carregarDadosIniciais();

    // =============================================
    // HISTÓRICO DE CONVERSAS DA IA NO PERFIL (Real do Banco)
    // =============================================
    const renderizarHistoricoPerfil = async () => {
        const lista = document.getElementById("perfil-historico-lista");
        if (!lista) return;

        const { history, error } = await chatService.getUserHistory();
        lista.innerHTML = "";

        if (error || history.length === 0) {
            lista.innerHTML = `
                <div class="perfil-historico-vazio">
                    <i class="fas fa-comment-medical"></i>
                    <p>Nenhuma consulta registrada.</p>
                    <small>Suas conversas com a IA de sintomas aparecerão aqui.</small>
                </div>
            `;
            return;
        }

        history.forEach((sessao) => {
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
    const handleLogout = async () => {
        await authService.signOut();
        window.location.href = ROUTES.home;
    };

    document.getElementById("btnLogout")?.addEventListener("click", handleLogout);
    document.getElementById("btnLogoutForm")?.addEventListener("click", handleLogout);

    // =============================================
    // SUBMIT DO FORMULÁRIO (Conectado ao Supabase)
    // =============================================
    const getFieldVal = (id, type) => {
        const rawVal = document.getElementById(id).value.trim();
        if (rawVal === "") return null;
        if (type === "number") return Number(rawVal);
        return rawVal;
    };

    perfilForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btnSave = perfilForm.querySelector('button[type="submit"]');
        const originalText = btnSave.textContent;
        btnSave.disabled = true;
        btnSave.textContent = "Salvando...";

        const payload = {
            sexo:                       getFieldVal("sexo", "string"),
            idade:                      getFieldVal("idade", "number"),
            peso:                       getFieldVal("peso", "number"),
            altura:                     getFieldVal("altura", "number"),
            fuma:                       document.querySelector('input[name="fuma"]:checked').value === "true",
            bebe:                       document.querySelector('input[name="bebe"]:checked').value === "true",
            alergia_medicamento:        getFieldVal("alergia_medicamento", "string"),
            possui_deficiencia:         getFieldVal("possui_deficiencia", "string"),
            contato_medico_particular:  getFieldVal("contato_medico", "string")
        };

        // Salva no SUPABASE
        const { profile, error } = await profileService.saveProfile(payload);

        btnSave.disabled = false;
        btnSave.textContent = originalText;

        if (error) {
            alert("Erro ao salvar no banco: " + error.message);
            return;
        }

        // Sucesso
        dadosSaude = profile;
        localStorage.setItem("dadosSaude", JSON.stringify(dadosSaude)); // Mantém cache por conveniência

        // Volta para o modo visualização e atualiza os textos
        perfilForm.style.display = "none";
        viewMode.style.display   = "block";
        atualizarModoVisualizacao();

        console.log("Dados salvos no Supabase com sucesso!");
    });
});
