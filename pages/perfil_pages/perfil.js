import { createSidebar } from "../../shared/sidebar.js";
import { createFooter } from "../../shared/footer.js";
import { ROUTES } from "../../config/routes/routes.js";
import { authService } from "../../Services/authService.js";
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

  // Atualiza o nome/email do usuário logado no cabeçalho
  const viewNomeTitulo = document.getElementById("viewNomeTitulo");
  const displayEmail = document.getElementById("displayEmail");

  if (user) {
    if (viewNomeTitulo) {
      viewNomeTitulo.textContent =
        user.user_metadata?.full_name || user.user_metadata?.name || "Paciente";
    }
    if (displayEmail) {
      displayEmail.textContent = user.email;
    }
  }

  createSidebar();
  createFooter();

  // =============================================
  // REFERÊNCIAS DOS DOIS MODOS
  // =============================================
  const viewMode = document.getElementById("viewMode");
  const perfilForm = document.getElementById("perfilForm");

  // Botões de alternância de modo
  const btnEditSaude = document.getElementById("btnEditSaude");
  const btnCancelEdit = document.getElementById("btnCancelEdit");

  // Campos de texto no modo visualização
  const viewIdade = document.getElementById("view-idade");
  const viewPeso = document.getElementById("view-peso");
  const viewAltura = document.getElementById("view-altura");
  const viewSexo = document.getElementById("view-sexo");
  const viewFuma = document.getElementById("view-fuma");
  const viewBebe = document.getElementById("view-bebe");
  const viewAlergia = document.getElementById("view-alergia");
  const viewDeficiencia = document.getElementById("view-deficiencia");
  const viewContatoNome = document.getElementById("view-contato-nome");
  const viewContatoEmail = document.getElementById("view-contato-email");
  const viewContatoTelefone = document.getElementById("view-contato-telefone");

  // =============================================
  // HELPER: formata valor para exibição em texto
  // =============================================
  const formatarValor = (val, sufixo = "") => {
    if (
      val === null ||
      val === undefined ||
      val === "" ||
      (Array.isArray(val) && val.length === 0)
    )
      return "Não Informado";
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

    viewIdade.textContent = formatarValor(dadosSaude.idade, " anos");
    viewPeso.textContent = formatarValor(dadosSaude.peso, " kg");
    viewAltura.textContent = formatarValor(dadosSaude.altura, " m");
    viewSexo.textContent = formatarValor(dadosSaude.sexo);
    viewFuma.textContent = formatarBooleano(dadosSaude.fuma);
    viewBebe.textContent = formatarBooleano(dadosSaude.bebe);

    // Conversão para exibição amigável dos tipos do banco
    viewAlergia.textContent = formatarValor(dadosSaude.alergia_medicamento);
    viewDeficiencia.textContent = formatarValor(dadosSaude.possui_deficiencia);
    viewContatoNome.textContent = formatarValor(dadosSaude.contato_medico_nome);
    viewContatoEmail.textContent = formatarValor(dadosSaude.contato_medico_email);
    viewContatoTelefone.textContent = formatarValor(dadosSaude.contato_medico_telefone);
  };

  // =============================================
  // POPULA O FORMULÁRIO com os dados existentes
  // =============================================
  const preencherFormulario = () => {
    if (!dadosSaude) return;

    if (dadosSaude.idade)
      document.getElementById("idade").value = dadosSaude.idade;
    if (dadosSaude.peso)
      document.getElementById("peso").value = dadosSaude.peso;
    if (dadosSaude.altura)
      document.getElementById("altura").value = dadosSaude.altura;
    if (dadosSaude.sexo)
      document.getElementById("sexo").value = dadosSaude.sexo;

    if (dadosSaude.alergia_medicamento && dadosSaude.alergia_medicamento !== "false")
        document.getElementById("alergia_medicamento").value = dadosSaude.alergia_medicamento;
    
    if (dadosSaude.possui_deficiencia && dadosSaude.possui_deficiencia !== "false")
        document.getElementById("possui_deficiencia").value = dadosSaude.possui_deficiencia;

    if (dadosSaude.contato_medico_nome) {
      document.getElementById("contato_medico_nome").value =
        dadosSaude.contato_medico_nome;
    }
    if (dadosSaude.contato_medico_email) {
      document.getElementById("contato_medico_email").value =
        dadosSaude.contato_medico_email;
    }
    if (dadosSaude.contato_medico_telefone) {
      document.getElementById("contato_medico_telefone").value =
        dadosSaude.contato_medico_telefone;
    }

    // Radios
    const fumaVal = dadosSaude.fuma?.toString();
    if (fumaVal) {
      const fumaRadio = document.querySelector(
        `input[name="fuma"][value="${fumaVal}"]`,
      );
      if (fumaRadio) fumaRadio.checked = true;
    }

    const bebeVal = dadosSaude.bebe?.toString();
    if (bebeVal) {
      const bebeRadio = document.querySelector(
        `input[name="bebe"][value="${bebeVal}"]`,
      );
      if (bebeRadio) bebeRadio.checked = true;
    }
  };

  // Carrega do banco ao iniciar
  carregarDadosIniciais();

  // =============================================
  // HISTÓRICO DE CONVERSAS DA IA NO PERFIL (Real do Banco)
  // =============================================
  let sessoesHistoricoCache = []; // Cache para abrir o modal

  const renderizarHistoricoPerfil = async () => {
    const lista = document.getElementById("perfil-historico-lista");
    if (!lista) return;

    const { history, error } = await chatService.getUserHistory();
    lista.innerHTML = "";
    sessoesHistoricoCache = history || [];

    if (error || !history || history.length === 0) {
      lista.innerHTML = `
                <div class="perfil-historico-vazio">
                    <i class="fas fa-comment-medical"></i>
                    <p>Nenhuma consulta registrada.</p>
                    <small>Suas conversas com a IA de sintomas aparecerão aqui.</small>
                </div>
            `;
      return;
    }

    history.forEach((sessao, index) => {
      const item = document.createElement("div");
      item.className = "perfil-historico-item";

      const dataFormatada = new Date(sessao.created_at).toLocaleString("pt-BR");

      item.innerHTML = `
                <div class="perfil-historico-item__data">
                    <i class="fas fa-calendar-alt"></i> ${dataFormatada}
                </div>
                <div class="perfil-historico-item__row">
                    <span class="perfil-historico-badge perfil-historico-badge--user">Você</span>
                    <p>${sessao.descricao_usuario || "Consulta de sintomas"}</p>
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

  renderizarHistoricoPerfil();

  // Toggle "Ver mais / Ocultar" do histórico no perfil
  const btnVerHistorico = document.getElementById("btn-ver-historico");
  const listaHistorico = document.getElementById("perfil-historico-lista");

  if (btnVerHistorico && listaHistorico) {
    btnVerHistorico.addEventListener("click", () => {
      const aberto = !listaHistorico.classList.contains(
        "perfil-historico-lista--oculto",
      );

      if (aberto) {
        listaHistorico.classList.add("perfil-historico-lista--oculto");
        btnVerHistorico.querySelector("span").textContent =
          "Ver histórico completo";
        btnVerHistorico.querySelector("i").className = "fas fa-chevron-down";
      } else {
        listaHistorico.classList.remove("perfil-historico-lista--oculto");
        btnVerHistorico.querySelector("span").textContent = "Ocultar histórico";
        btnVerHistorico.querySelector("i").className = "fas fa-chevron-up";
      }
    });
  }

  // =============================================
  // LÓGICA DO MODAL DE DETALHES
  // =============================================
  const modalHistorico = document.getElementById("modal-historico");
  const closeModalHistorico = document.getElementById("closeModalHistorico");

  const abrirModalHistorico = (dados) => {
    if (!modalHistorico) return;

    document.getElementById("modal-data").textContent = new Date(
      dados.created_at,
    ).toLocaleString("pt-BR");
    document.getElementById("modal-usuario").textContent =
      dados.descricao_usuario;
    document.getElementById("modal-ia").textContent = dados.resposta_ia;

    modalHistorico.classList.add("show");
    document.body.style.overflow = "hidden"; // Trava scroll do fundo
  };

  const fecharModalHistorico = () => {
    modalHistorico.classList.remove("show");
    document.body.style.overflow = ""; // Libera scroll
  };

  closeModalHistorico?.addEventListener("click", fecharModalHistorico);
  window.addEventListener("click", (e) => {
    if (e.target === modalHistorico) fecharModalHistorico();
  });

  // Delegação de cliques para botões "Ver detalhes"
  listaHistorico?.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-detalhes-ia");
    if (btn) {
      const idx = btn.getAttribute("data-index");
      if (sessoesHistoricoCache[idx]) {
        abrirModalHistorico(sessoesHistoricoCache[idx]);
      }
    }
  });

  // =============================================
  // ALTERNÂNCIA: Visualização → Edição
  // =============================================
  btnEditSaude?.addEventListener("click", () => {
    preencherFormulario();
    viewMode.style.display = "none";
    perfilForm.style.display = "block";
  });

  // =============================================
  // ALTERNÂNCIA: Edição → Visualização (cancelar)
  // =============================================
  btnCancelEdit?.addEventListener("click", () => {
    perfilForm.style.display = "none";
    viewMode.style.display = "block";
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
    const el = document.getElementById(id);
    if (!el) return null;
    const rawVal = el.value.trim();
    if (rawVal === "") return null;
    if (type === "number") return Number(rawVal);
    return rawVal;
  };

  perfilForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btnSave = perfilForm.querySelector('button[type="submit"]');
    const originalText = btnSave.innerHTML;
    btnSave.disabled = true;
    btnSave.textContent = "Salvando...";

    const payload = {
      sexo: getFieldVal("sexo", "string"),
      idade: getFieldVal("idade", "number"),
      peso: getFieldVal("peso", "number"),
      altura: getFieldVal("altura", "number"),
      fuma:
        document.querySelector('input[name="fuma"]:checked')?.value === "true",
      bebe:
        document.querySelector('input[name="bebe"]:checked')?.value === "true",
      alergia_medicamento: getFieldVal("alergia_medicamento", "string"),
      possui_deficiencia: getFieldVal("possui_deficiencia", "string"),
      contato_medico_nome: getFieldVal("contato_medico_nome", "string"),
      contato_medico_email: getFieldVal("contato_medico_email", "string"),
      contato_medico_telefone: getFieldVal("contato_medico_telefone", "string"),
    };

    // Salva no SUPABASE
    const { profile, error } = await profileService.saveProfile(payload);

    btnSave.disabled = false;
    btnSave.innerHTML = originalText;

    if (error) {
      alert("Erro ao salvar no banco: " + error.message);
      return;
    }

    // Sucesso
    dadosSaude = profile;
    
    // Volta para o modo visualização e atualiza os textos
    perfilForm.style.display = "none";
    viewMode.style.display = "block";
    atualizarModoVisualizacao();

    console.log("Dados salvos no Supabase com sucesso!");
  });
});
