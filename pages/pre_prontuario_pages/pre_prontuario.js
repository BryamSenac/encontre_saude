/**
 * pre_prontuario.js
 * Lógica do formulário multi-step de Pré-Prontuário — Encontre Saúde
 */

import { createSidebar } from './../../shared/sidebar.js';

// ─── Inicialização da Sidebar ─────────────────────────────────────────────────
createSidebar();

// ─── Constante da URL do Backend ─────────────────────────────────────────────
const API_URL = 'http://localhost:3001/api/pre-prontuario';

// ─── Estado do Formulário ─────────────────────────────────────────────────────
let currentStep = 1;
const TOTAL_STEPS = 4;

// ─── Elementos DOM ────────────────────────────────────────────────────────────
const form       = document.getElementById('pp-form');
const btnNext    = document.getElementById('btn-next');
const btnBack    = document.getElementById('btn-back');
const btnSubmit  = document.getElementById('btn-submit');
const btnDownload = document.getElementById('btn-download');
const toast      = document.getElementById('pp-toast');
const toastIcon  = document.getElementById('toast-icon');
const toastMsg   = document.getElementById('toast-msg');

// ─── Máscara de CPF ───────────────────────────────────────────────────────────
document.getElementById('cpf')?.addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{3})/, '$1.$2');
  this.value = v;
});

// ─── Máscara de Telefone ──────────────────────────────────────────────────────
document.getElementById('telefone')?.addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10)      v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (v.length > 6)  v = v.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  else if (v.length > 2)  v = v.replace(/(\d{2})(\d+)/, '($1) $2');
  this.value = v;
});

// ─── Seleção de Canal ─────────────────────────────────────────────────────────
document.querySelectorAll('input[name="canalEnvio"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const isEmail     = radio.value === 'email';
    const isWhatsApp  = radio.value === 'whatsapp';

    document.getElementById('campo-email').style.display     = isEmail    ? 'block' : 'none';
    document.getElementById('campo-whatsapp').style.display  = isWhatsApp ? 'block' : 'none';

    // Limpa o campo do canal que não foi selecionado
    if (isEmail)    document.getElementById('whatsapp').value = '';
    if (isWhatsApp) document.getElementById('email').value    = '';

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
  const el   = document.getElementById(id);
  const erro = document.getElementById(`erro-${id}`);
  if (el)   el.classList.add('error');
  if (erro) erro.textContent = `⚠️ ${mensagem}`;
}

function marcarValido(id) {
  const el   = document.getElementById(id);
  const erro = document.getElementById(`erro-${id}`);
  if (el)   { el.classList.remove('error'); el.classList.add('valid'); }
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
  btnNext.style.display   = isLastStep ? 'none' : 'flex';

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

// ─── Submit do Formulário ─────────────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validarStep(4)) return;

  const sintomas = [...document.querySelectorAll('input[name="sintomas"]:checked')].map((c) => c.value);
  const canal    = document.querySelector('input[name="canalEnvio"]:checked')?.value;

  const payload = {
    // Step 1
    nome:             val('nome'),
    dataNascimento:   val('dataNascimento'),
    cpf:              val('cpf'),
    sexo:             val('sexo'),
    telefone:         val('telefone'),
    // Step 2
    queixaPrincipal:       val('queixaPrincipal'),
    tempoPrincipalSintoma: val('tempoPrincipalSintoma'),
    sintomas,
    pressaoArterial:    val('pressaoArterial')    || null,
    frequenciaCardiaca: val('frequenciaCardiaca')  ? Number(val('frequenciaCardiaca'))  : null,
    temperatura:        val('temperatura')          ? Number(val('temperatura'))          : null,
    saturacaoOxigenio:  val('saturacaoOxigenio')   ? Number(val('saturacaoOxigenio'))   : null,
    peso:               val('peso')                 ? Number(val('peso'))                 : null,
    altura:             val('altura')               ? Number(val('altura'))               : null,
    // Step 3
    alergias:               val('alergias')               || null,
    medicamentosEmUso:      val('medicamentosEmUso')      || null,
    doencasPreexistentes:   val('doencasPreexistentes')   || null,
    historicoFamiliar:      val('historicoFamiliar')      || null,
    observacoesAdicionais:  val('observacoesAdicionais')  || null,
    // Step 4
    canalEnvio: canal,
    email:      canal === 'email'     ? val('email')     : undefined,
    whatsapp:   canal === 'whatsapp'  ? val('whatsapp')  : undefined,
  };

  // Estado de loading
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<i class="fas fa-spinner"></i> <span>Gerando e Enviando...</span>';

  try {
    const res  = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      mostrarToast('success', `<i class="fas fa-check-circle"></i>`, data.message);
      form.reset();
      irParaStep(1);
      // Zera todos os indicadores de progresso
      document.querySelectorAll('.pp-step').forEach((s) => {
        s.classList.remove('active', 'done');
        if (s.dataset.step === '1') s.classList.add('active');
      });
      document.querySelectorAll('.pp-step-line').forEach((l) => l.classList.remove('done'));
    } else {
      const msg = data.errors
        ? data.errors.map((e) => e.message).join('<br>')
        : data.message;
      mostrarToast('error', `<i class="fas fa-triangle-exclamation"></i>`, msg);
    }
  } catch (err) {
    console.error('Erro ao enviar pré-prontuário:', err);
    mostrarToast('error', `<i class="fas fa-wifi"></i>`, 'Não foi possível conectar ao servidor. Verifique sua conexão.');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Enviar Documento</span>';
  }
});

// ─── Download do PDF ──────────────────────────────────────────────────────────
btnDownload?.addEventListener('click', async () => {
  // Valida apenas os steps obrigatórios (1 e 2)
  if (!validarStep(1) || !validarStep(2)) {
    mostrarToast('error', '<i class="fas fa-triangle-exclamation"></i>', 'Preencha os dados obrigatórios antes de baixar.');
    return;
  }

  const sintomas = [...document.querySelectorAll('input[name="sintomas"]:checked')].map((c) => c.value);

  const payload = {
    nome:             val('nome'),
    dataNascimento:   val('dataNascimento'),
    cpf:              val('cpf'),
    sexo:             val('sexo'),
    telefone:         val('telefone'),
    queixaPrincipal:       val('queixaPrincipal'),
    tempoPrincipalSintoma: val('tempoPrincipalSintoma'),
    sintomas,
    pressaoArterial:    val('pressaoArterial')    || null,
    frequenciaCardiaca: val('frequenciaCardiaca')  ? Number(val('frequenciaCardiaca'))  : null,
    temperatura:        val('temperatura')          ? Number(val('temperatura'))          : null,
    saturacaoOxigenio:  val('saturacaoOxigenio')   ? Number(val('saturacaoOxigenio'))   : null,
    peso:               val('peso')                 ? Number(val('peso'))                 : null,
    altura:             val('altura')               ? Number(val('altura'))               : null,
    alergias:               val('alergias')               || null,
    medicamentosEmUso:      val('medicamentosEmUso')      || null,
    doencasPreexistentes:   val('doencasPreexistentes')   || null,
    historicoFamiliar:      val('historicoFamiliar')      || null,
    observacoesAdicionais:  val('observacoesAdicionais')  || null,
    canalEnvio: 'download',  // canal especial para download direto
  };

  btnDownload.disabled = true;
  btnDownload.innerHTML = '<i class="fas fa-spinner"></i> Gerando PDF...';

  try {
    const res  = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.success && data.download) {
      // Converte Base64 → Blob → download automático
      const bytes      = atob(data.pdf);
      const byteArray  = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) byteArray[i] = bytes.charCodeAt(i);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href  = URL.createObjectURL(blob);
      link.download = data.filename || 'pre-prontuario.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      mostrarToast('success', '<i class="fas fa-check-circle"></i>', 'PDF baixado com sucesso!');
    } else {
      // Mostra exatamente quais campos falharam
      if (data.errors && data.errors.length > 0) {
        console.error('Erros de validação:', data.errors);
        const camposErro = data.errors.map((e) => `<b>${e.field}</b>: ${e.message}`).join('<br>');
        mostrarToast('error', '<i class="fas fa-triangle-exclamation"></i>', camposErro);
      } else {
        mostrarToast('error', '<i class="fas fa-triangle-exclamation"></i>', data.message || 'Erro ao gerar PDF.');
      }
    }
  } catch (err) {
    console.error('Erro ao baixar PDF:', err);
    mostrarToast('error', '<i class="fas fa-wifi"></i>', 'Não foi possível conectar ao servidor.');
  } finally {
    btnDownload.disabled = false;
    btnDownload.innerHTML = '<i class="fas fa-download"></i> Baixar PDF';
  }
});

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimeout;
function mostrarToast(tipo, icone, mensagem) {
  clearTimeout(toastTimeout);
  toast.className = `pp-toast ${tipo}`;
  toastIcon.innerHTML = icone;
  toastMsg.innerHTML  = mensagem;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 6000);
}
