/**
 * pre_prontuario.js
 * Lógica do formulário multi-step de Pré-Prontuário — Encontre Saúde
 */

import { createSidebar } from './../../shared/sidebar.js';
import { profileService } from './../../Services/profileService.js';
import { chatService } from './../../Services/chatService.js';
import { authService } from './../../Services/authService.js';

// ─── Inicialização da Sidebar ─────────────────────────────────────────────────
createSidebar();

// ─── Estado do Formulário ─────────────────────────────────────────────────────
let currentStep = 1;
const TOTAL_STEPS = 4;

// Função para preencher o formulário automaticamente com dados do Supabase
async function carregarDadosAutomaticos() {
    console.group("🏥 [Pré-Prontuário] Carregando dados automáticos...");
    
    // 1. Verifica se está logado
    const { session, user } = await authService.getUserSession();
    if (!session) {
        console.warn("Usuário não logado. Pulando carregamento automático.");
        console.groupEnd();
        return;
    }

    // Preenche o nome se disponível na sessão
    if (user && user.user_metadata) {
        const nomeCompleto = user.user_metadata.full_name || user.user_metadata.name;
        if (nomeCompleto) {
            const campoNome = document.getElementById('nome');
            if (campoNome && !campoNome.value) campoNome.value = nomeCompleto;
        }
    }

    // 2. Busca dados do Perfil (Tabela dados_saude)
    const { profile } = await profileService.getProfile();
    if (profile) {
        console.log("Preenchendo dados do perfil...", profile);
        if (profile.sexo) document.getElementById('sexo').value = profile.sexo;
        if (profile.peso) document.getElementById('peso').value = profile.peso;
        if (profile.altura) document.getElementById('altura').value = profile.altura;
        
        // Novos campos sincronizados
        if (profile.data_nascimento) document.getElementById('dataNascimento').value = profile.data_nascimento;
        if (profile.CPF) {
          const campoCpf = document.getElementById('cpf');
          if (campoCpf) {
            campoCpf.value = profile.CPF;
            campoCpf.dispatchEvent(new Event('input')); // Dispara máscara
          }
        }
        if (profile.telefone) {
          const campoTel = document.getElementById('telefone');
          if (campoTel) {
            campoTel.value = profile.telefone;
            campoTel.dispatchEvent(new Event('input')); // Dispara máscara
          }
        }
    }

    // 3. Fallback para o Telefone caso não esteja no perfil, busca do Auth
    if (user && user.phone) {
      const campoTel = document.getElementById('telefone');
      if (campoTel && !campoTel.value) {
        campoTel.value = user.phone;
        campoTel.dispatchEvent(new Event('input'));
      }
    }

    // 4. Busca última consulta da IA
    const { data: consulta } = await chatService.getLatestFullConsultation();
    if (consulta) {
        console.log("Preenchendo dados da última consulta IA...");
        
        // Queixa Principal
        if (consulta.chat.descricao_usuario) {
            document.getElementById('queixaPrincipal').value = consulta.chat.descricao_usuario;
        }

        // Sintomas (Checkboxes)
        if (consulta.symptoms) {
            const keys = Object.keys(consulta.symptoms);
            keys.forEach(key => {
                if (consulta.symptoms[key] === true) {
                    const checkbox = document.querySelector(`input[name="sintomas"][value="${key}"]`);
                    if (checkbox) checkbox.checked = true;
                }
            });
        }
    }
    
    console.log("Carregamento automático finalizado!");
    console.groupEnd();
}

// Inicializa o carregamento
document.addEventListener('DOMContentLoaded', carregarDadosAutomaticos);

// ─── Elementos DOM ────────────────────────────────────────────────────────────
const form = document.getElementById('pp-form');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const btnDownload = document.getElementById('btn-download');
const toast = document.getElementById('pp-toast');
const toastIcon = document.getElementById('toast-icon');
const toastMsg = document.getElementById('toast-msg');

// ─── Máscara de CPF ───────────────────────────────────────────────────────────
document.getElementById('cpf')?.addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{3})/, '$1.$2');
  this.value = v;
});

// ─── Máscara de Telefone ──────────────────────────────────────────────────────
document.getElementById('telefone')?.addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '($1) $2');
  this.value = v;
});

// ─── Carregar Dados da IA ───────────────────────────────────────────────────
function carregarDadosIA() {
  const dadosBrutos = localStorage.getItem('ultimaTriagemIA');
  if (!dadosBrutos) return;

  try {
    const dados = JSON.parse(dadosBrutos);
    const agora = Date.now();
    const VINTE_MINUTOS = 20 * 60 * 1000;

    // Só usa se for recente (menos de 20 minutos)
    if (agora - dados.timestamp < VINTE_MINUTOS) {
      const field = document.getElementById('queixaPrincipal');
      if (field && !field.value) { // Só preenche se estiver vazio
        const { textoUsuario, resultadoIA } = dados;

        field.value = `RELATO DO PACIENTE: ${textoUsuario}\n\n` +
          `ANÁLISE IA (Nível ${resultadoIA.nivel}): ${resultadoIA.resumo}\n` +
          `RECOMENDAÇÃO: ${resultadoIA.recomendacao}`;

        // Dispara evento de input para validar o campo se necessário
        field.dispatchEvent(new Event('input'));
      }
    }
  } catch (e) {
    console.error("Erro ao carregar dados da IA:", e);
  }
}

// ─── Salvamento Automático (Auto-Save) ─────────────────────────────────────────
const STORAGE_KEY = 'rascunhoPreProntuario';

function salvarProgresso() {
  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    // Lidar com múltiplos checkboxes (como 'sintomas')
    if (data[key]) {
      if (!Array.isArray(data[key])) data[key] = [data[key]];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    data,
    currentStep,
    timestamp: Date.now()
  }));
}

function carregarProgresso() {
  const rascunho = localStorage.getItem(STORAGE_KEY);
  if (!rascunho) return;

  try {
    const { data, step } = JSON.parse(rascunho);
    
    // Preenche campos de texto, select, etc.
    Object.keys(data).forEach(key => {
      const val = data[key];
      const element = form.elements[key];

      if (!element) return;

      if (element.type === 'checkbox') {
        // Se for um único checkbox ou array de checkboxes
        if (Array.isArray(val)) {
           const checkboxes = form.querySelectorAll(`input[name="${key}"]`);
           checkboxes.forEach(cb => cb.checked = val.includes(cb.value));
        } else {
          element.checked = !!val;
        }
      } else if (element instanceof RadioNodeList || element.type === 'radio') {
        const radios = form.querySelectorAll(`input[name="${key}"]`);
        radios.forEach(r => r.checked = r.value === val);
      } else {
        element.value = val;
      }

      // Dispara eventos para aplicar máscaras e atualizar visibilidade de campos condicionais
      element.dispatchEvent(new Event('input'));
      element.dispatchEvent(new Event('change'));
    });

    // Restaura o passo se necessário (opcional, vamos manter no step 1 para segurança)
    // if (step > 1) irParaStep(step);

  } catch (e) {
    console.error("Erro ao carregar rascunho:", e);
  }
}

function limparRascunho() {
  localStorage.removeItem(STORAGE_KEY);
}

// Ouvinte para salvar a cada mudança
form.addEventListener('input', () => salvarProgresso());
form.addEventListener('change', () => salvarProgresso());

// ─── Carregar Dados ao Iniciar ────────────────────────────────────────────────
carregarProgresso();
carregarDadosIA();

// ─── Seleção de Canal ─────────────────────────────────────────────────────────
document.querySelectorAll('input[name="canalEnvio"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const isEmail = radio.value === 'email';
    const isWhatsApp = radio.value === 'whatsapp';

    document.getElementById('campo-email').style.display = isEmail ? 'block' : 'none';
    document.getElementById('campo-whatsapp').style.display = isWhatsApp ? 'block' : 'none';

    // Limpa o campo do canal que não foi selecionado
    if (isEmail) document.getElementById('whatsapp').value = '';
    if (isWhatsApp) document.getElementById('email').value = '';

    limparErro('canalEnvio');
  });
});

// ─── Validação por Step ───────────────────────────────────────────────────────
function validarStep(step) {
  let valido = true;

  if (step === 1) {
    valido = validarCampo('nome', (v) => v.trim().length >= 3, 'Nome deve ter pelo menos 3 caracteres.') && valido;
    valido = validarCampo('dataNascimento', (v) => !!v, 'Informe a data de nascimento.') && valido;
    valido = validarCampo('cpf', (v) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v), 'CPF inválido. Use: 000.000.000-00') && valido;
    valido = validarCampo('sexo', (v) => !!v, 'Selecione o sexo biológico.') && valido;
    valido = validarCampo('telefone', (v) => v.replace(/\D/g, '').length >= 10, 'Telefone inválido.') && valido;
  }

  if (step === 2) {
    valido = validarCampo('queixaPrincipal', (v) => v.trim().length >= 10, 'Descreva a queixa com pelo menos 10 caracteres.') && valido;
  }

  if (step === 4) {
    const canal = document.querySelector('input[name="canalEnvio"]:checked')?.value;
    if (!canal) {
      mostrarErro('canalEnvio', 'Selecione como deseja receber o documento.');
      valido = false;
    } else if (canal === 'email') {
      valido = validarCampo('email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'E-mail inválido.') && valido;
    } else if (canal === 'whatsapp') {
      valido = validarCampo('whatsapp', (v) => v.replace(/\D/g, '').length >= 11, 'Número inválido. Inclua o +55 e DDD.') && valido;
    }
  }

  return valido;
}

function validarCampo(id, regra, mensagem) {
  const el = document.getElementById(id);
  if (!el) return true;
  const ok = regra(el.value);
  ok ? marcarValido(id) : mostrarErro(id, mensagem);
  return ok;
}

function mostrarErro(id, mensagem) {
  const el = document.getElementById(id);
  const erro = document.getElementById(`erro-${id}`);
  if (el) el.classList.add('error');
  if (erro) erro.textContent = `⚠️ ${mensagem}`;
}

function marcarValido(id) {
  const el = document.getElementById(id);
  const erro = document.getElementById(`erro-${id}`);
  if (el) { el.classList.remove('error'); el.classList.add('valid'); }
  if (erro) erro.textContent = '';
}

function limparErro(id) {
  const erro = document.getElementById(`erro-${id}`);
  if (erro) erro.textContent = '';
}

// ─── Navegação entre Steps ────────────────────────────────────────────────────
function irParaStep(novoStep) {
  // Oculta o step atual
  document.getElementById(`step-${currentStep}`)?.classList.remove('active');

  // Marca step anterior como done
  const stepEl = document.getElementById(`progress-step-${currentStep}`);
  if (stepEl && novoStep > currentStep) {
    stepEl.classList.remove('active');
    stepEl.classList.add('done');
    const line = document.getElementById(`line-${currentStep}-${currentStep + 1}`);
    if (line) line.classList.add('done');
  }

  currentStep = novoStep;

  // Ativa o novo step
  document.getElementById(`step-${currentStep}`)?.classList.add('active');
  const novoStepEl = document.getElementById(`progress-step-${currentStep}`);
  if (novoStepEl) {
    novoStepEl.classList.remove('done');
    novoStepEl.classList.add('active');
  }

  // Atualiza botões
  btnBack.style.visibility = currentStep === 1 ? 'hidden' : 'visible';

  const isLastStep = currentStep === TOTAL_STEPS;
  btnNext.style.display = isLastStep ? 'none' : 'flex';

  // Ao chegar no step 4, preenche o resumo
  if (currentStep === 4) preencherResumo();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

btnNext.addEventListener('click', () => {
  if (validarStep(currentStep) && currentStep < TOTAL_STEPS) {
    irParaStep(currentStep + 1);
  }
});

btnBack.addEventListener('click', () => {
  if (currentStep > 1) {
    // Remove classe done do step atual ao voltar
    const stepEl = document.getElementById(`progress-step-${currentStep}`);
    if (stepEl) { stepEl.classList.remove('active'); stepEl.classList.remove('done'); }
    const line = document.getElementById(`line-${currentStep - 1}-${currentStep}`);
    if (line) line.classList.remove('done');
    irParaStep(currentStep - 1);
  }
});

// ─── Preenchimento do Resumo ──────────────────────────────────────────────────
function preencherResumo() {
  const resumo = document.getElementById('resumo-content');
  if (!resumo) return;

  const sintomas = [...document.querySelectorAll('input[name="sintomas"]:checked')].map((c) => c.value);

  const campos = [
    { label: 'Nome', valor: val('nome') },
    { label: 'Nascimento', valor: formatarData(val('dataNascimento')) },
    { label: 'Sexo', valor: val('sexo') },
    { label: 'Queixa Principal', valor: val('queixaPrincipal')?.slice(0, 60) + (val('queixaPrincipal')?.length > 60 ? '...' : '') },
    { label: 'Sintomas', valor: sintomas.length ? sintomas.join(', ') : 'Nenhum marcado' },
    { label: 'Pressão Arterial', valor: val('pressaoArterial') || '—' },
  ];

  resumo.innerHTML = campos.map((c) => `
    <div class="pp-resumo-item">
      <span>${c.label}</span>
      <span>${c.valor || '—'}</span>
    </div>
  `).join('');
}

function val(id) { return document.getElementById(id)?.value || ''; }
function formatarData(d) {
  if (!d) return '—';
  const [a, m, dia] = d.split('-');
  return `${dia}/${m}/${a}`;
}

// ─── Geração de PDF Nativa Vetorial ───────────────────────────────────────────
async function gerarArquivoPDFPuro(btnElement, onCompleteMessage) {
  const originalText = btnElement.innerHTML;
  btnElement.disabled = true;
  btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Documento...';

  try {
    const nomeSafe = (val('nome') || 'paciente').replace(/\s+/g, '-').toLowerCase();

    // Carrega o motor vetorial nativo (jsPDF) dinamicamente sem afetar o HTML
    if (!window.jspdf) {
      await new Promise((r, j) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = r;
        s.onerror = j;
        document.head.appendChild(s);
      });
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Fundo Verde Superior
    doc.setFillColor(12, 74, 69); // #0c4a45
    doc.rect(0, 0, 210, 30, 'F');
    // Linha de Detalhe #14b8a6
    doc.setDrawColor(20, 184, 166);
    doc.setLineWidth(1.5);
    doc.line(0, 30, 210, 30);

    // Titulo e Subtitulo
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ENCONTRE SAÚDE", 15, 15);
    doc.setTextColor(20, 184, 166);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Pré-Prontuário Digital | Documento Confidencial", 15, 22);

    // Data Atual
    const d = new Date();
    const dataH = d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    doc.setTextColor(203, 213, 225);
    doc.text("Gerado em: " + dataH, 195, 15, { align: 'right' });

    let y = 40;

    function createSessionHeader(title) {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFillColor(13, 148, 136); // #0d9488
      doc.rect(15, y, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(title, 18, y + 5.5);
      y += 15;
    }

    function createProp(label, value, x, w) {
      doc.setTextColor(100, 116, 139); // TextSlate
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(label, x, y);

      doc.setTextColor(15, 23, 42); // BoldSlate
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      const strArr = doc.splitTextToSize(value || '—', w);
      doc.text(strArr, x, y + 5);
      return strArr.length * 5;
    }

    // Seç 1: Pessoais
    createSessionHeader("Dados Pessoais");
    const npNasc = val('dataNascimento') ? val('dataNascimento').split('-').reverse().join('/') : '—';
    createProp("Nome", val('nome') || '—', 15, 85);
    createProp("Nascimento", npNasc, 110, 85);
    y += 12;
    createProp("CPF", val('cpf') || '—', 15, 85);
    createProp("Sexo", val('sexo') || '—', 110, 85);
    y += 12;
    createProp("Telefone", val('telefone') || '—', 15, 85);
    y += 18;

    // Seç 2: Sintomas
    createSessionHeader("Sintomas");
    y += createProp("Queixa Principal", val('queixaPrincipal') || '—', 15, 180) + 5;

    const mk = Array.from(document.querySelectorAll('input[type="checkbox"][name="sintomas"]:checked'));
    const smk = mk.length ? mk.map(m => m.parentNode.textContent.trim()).join(', ') : 'Nenhum sintoma selecionado.';
    y += createProp("Sintomas Selecionados", smk, 15, 180) + 12;

    // Seç 3: Histórico e Sinais
    createSessionHeader("Histórico Clínico e Sinais Vitais");
    createProp("Alergias", val('alergias') || '—', 15, 85);
    createProp("Medicamentos em uso", val('medicamentosEmUso') || '—', 110, 85);
    y += 12;
    createProp("Doenças Preexistentes", val('doencasPreexistentes') || '—', 15, 85);
    createProp("Histórico Familiar", val('historicoFamiliar') || '—', 110, 85);
    y += 15;

    const vpa = val('pressaoArterial') ? val('pressaoArterial') + ' mmHg' : '—';
    const vfc = val('frequenciaCardiaca') ? val('frequenciaCardiaca') + ' bpm' : '—';
    const vtp = val('temperatura') ? val('temperatura') + ' °C' : '—';
    const vso = val('saturacaoOxigenio') ? val('saturacaoOxigenio') + ' %' : '—';

    doc.setDrawColor(226, 232, 240);
    createProp("Pressão Arterial", vpa, 15, 55);
    createProp("Frequência Card.", vfc, 75, 55);
    createProp("Temperatura", vtp, 135, 55);
    y += 12;
    createProp("Saturação O2", vso, 15, 55);
    const pP = val('peso'), aA = val('altura');
    createProp("Peso / Altura", (pP || aA) ? `${pP || '--'}kg / ${aA || '--'}cm` : '—', 75, 55);
    y += 18;

    createProp("Observações Adicionais", val('observacoesAdicionais') || '—', 15, 180);

    // Footer Base
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Este documento confidencial não substitui uma consulta médica presencial. — Encontre Saúde", 105, 285, { align: 'center' });

    // Download PDF (100% Client-Side)
    doc.save(`pre-prontuario-${nomeSafe}.pdf`);

    mostrarToast('success', '<i class="fas fa-check-circle"></i>', onCompleteMessage);
  } catch (err) {
    console.error('Erro ao gerar o PDF autônomo:', err);
    mostrarToast('error', '<i class="fas fa-triangle-exclamation"></i>', 'Erro inesperado ao gerar PDF no navegador.');
  } finally {
    btnElement.disabled = false;
    btnElement.innerHTML = originalText;
  }
}

// ─── Finalização (Salvar no Banco + Gerar PDF) ───────────────────────────────
btnDownload?.addEventListener('click', async () => {
  // Valida passos obrigatórios antes de prosseguir
  if (!validarStep(1) || !validarStep(2)) {
    mostrarToast('error', '<i class="fas fa-triangle-exclamation"></i>', 'Preencha os dados obrigatórios nos passos 1 e 2.');
    irParaStep(!validarStep(1) ? 1 : 2);
    return;
  }

  const originalText = btnDownload.innerHTML;
  btnDownload.disabled = true;
  btnDownload.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando e Gerando...';

  try {
    // 1. Mapeamento de Sintomas para o Banco
    const MAPPING_SINTOMAS = {
      "Febre": "febre",
      "Dor de Cabeça": "dor_de_cabeca",
      "Tosse": "tosse",
      "Falta de Ar": "falta_de_ar",
      "Dor no Peito": "dor_no_peito",
      "Náusea/Vômito": "nausea_vomito",
      "Diarreia": "diarreia",
      "Dor Abdominal": "dor_abdominal",
      "Dor nas Costas": "dor_nas_costas",
      "Tontura": "tontura",
      "Fraqueza/Cansaço": "fraqueza",
      "Coriza": "coriza"
    };

    const sintomasSelecionados = {};
    document.querySelectorAll('input[name="sintomas"]').forEach(cb => {
      const dbKey = MAPPING_SINTOMAS[cb.value] || cb.value.toLowerCase().replace(/\s+/g, '_');
      sintomasSelecionados[dbKey] = cb.checked;
    });

    // 2. Coleta dados clínicos para o histórico (JSON)
    const dadosClinicos = {
      alergias: val('alergias'),
      medicamentos: val('medicamentosEmUso'),
      doencas: val('doencasPreexistentes'),
      historico_familiar: val('historicoFamiliar'),
      pressao: val('pressaoArterial'),
      freq_cardiaca: val('frequenciaCardiaca'),
      temperatura: val('temperatura'),
      saturacao: val('saturacaoOxigenio'),
      peso: val('peso'),
      altura: val('altura'),
      observacoes: val('observacoesAdicionais')
    };

    // 3. Salva no Perfil (Tabela dados_saude: CPF, Telefone, Nascimento + Dados Clínicos)
    const dadosPerfil = {
      data_nascimento: val('dataNascimento'),
      cpf: val('cpf'),
      telefone: val('telefone'),
      sexo: val('sexo'),
      peso: parseFloat(val('peso')) || null,
      altura: parseFloat(val('altura')) || null,
      alergia_medicamento: val('alergias') ? true : false,
      
      // Adicionando dados clínicos ao perfil (Substituição automática no banco)
      alergias: val('alergias'),
      medicamentos: val('medicamentosEmUso'),
      doencas: val('doencasPreexistentes'),
      historico_familiar: val('historicoFamiliar'),
      pressao: val('pressaoArterial'),
      freq_cardiaca: val('frequenciaCardiaca'),
      temperatura: val('temperatura'),
      saturacao: val('saturacaoOxigenio'),
      observacoes: val('observacoesAdicionais')
    };
    
    console.log("🏥 [Pré-Prontuário] Dados do Perfil completos capturados:", dadosPerfil);
    console.log("💾 Sincronizando perfil com o banco de dados...");
    
    await profileService.saveProfile(dadosPerfil);

    // 4. Salva a Consulta no Histórico (Supabase)
    console.log("💾 Salvando consulta no histórico...");
    const queixa = document.getElementById('queixaPrincipal').value;
    const { error: saveError } = await chatService.saveManualConsultation(queixa, sintomasSelecionados, dadosClinicos);
    
    if (saveError) throw new Error("Erro ao salvar no banco: " + saveError.message);

    // 5. Gera e baixa o PDF
    await gerarArquivoPDFPuro(btnDownload, 'Dados salvos no histórico e PDF gerado com sucesso!');

    // 6. Limpeza e Reset
    limparRascunho();
    form.reset();
    irParaStep(1);
    
    // Reset visual do progresso
    document.querySelectorAll('.pp-step').forEach(s => s.classList.remove('active', 'done'));
    document.getElementById('progress-step-1').classList.add('active');
    document.querySelectorAll('.pp-step-line').forEach(l => l.classList.remove('done'));

  } catch (err) {
    console.error('❌ Erro na finalização:', err);
    mostrarToast('error', '<i class="fas fa-triangle-exclamation"></i>', 'Ocorreu um erro: ' + err.message);
  } finally {
    btnDownload.disabled = false;
    btnDownload.innerHTML = originalText;
  }
});

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimeout;
function mostrarToast(tipo, icone, mensagem) {
  clearTimeout(toastTimeout);
  toast.className = `pp-toast ${tipo}`;
  toastIcon.innerHTML = icone;
  toastMsg.innerHTML = mensagem;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 6000);
}
