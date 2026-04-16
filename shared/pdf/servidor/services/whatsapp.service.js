/**
 * whatsapp.service.js
 * Serviço de envio de PDF usando whatsapp-web.js nativo (sem API externa)
 */

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicializamos o cliente salvando a sessão em uma nova pasta para evitar bloqueios de memória do Chrome
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth2' }),
  puppeteer: {
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote']
  },
  authTimeoutMs: 120000, // Dá até 2 minutos para o Chrome interno iniciar
  qrMaxRetries: 3
});

let isReady = false;

// Evento: Geração do QR Code no console
client.on('qr', (qr) => {
  console.log('\n======================================================');
  console.log('📱 ESCANEIE O QR CODE ABAIXO NO SEU WHATSAPP');
  console.log('======================================================\n');
  qrcode.generate(qr, { small: true });
});

// Evento: Autenticado com sucesso
client.on('authenticated', () => {
  console.log('✅ WhatsApp Autenticado com Sucesso!');
});

// Evento: Cliente pronto para enviar mensagens
client.on('ready', () => {
  isReady = true;
  console.log('🟢 WhatsApp pronto para enviar as mensagens!');
});

// Evento: Desconectado
client.on('disconnected', (reason) => {
  console.log('❌ WhatsApp Desconectado! Motivo:', reason);
  isReady = false;
});

// Inicialização (Chamado pelo server.js no boot)
function iniciarWhatsApp() {
  console.log('⏳ Inicializando o Motor do WhatsApp. Aguarde alguns segundos...');
  client.initialize().catch(err => {
    console.error('❌ Erro Crítico ao iniciar o Motor do WhatsApp:', err);
  });
}

/**
 * Função para disparar a mensagem e o PDF para o paciente
 */
async function enviarWhatsApp(numero, nome, pdfBuffer) {
  if (!isReady) {
    throw new Error('O WhatsApp do sistema ainda não escaneou o QR Code ou não está "Pronto" para enviar.');
  }

  // 1. Tratar o número de telefone 
  let numeroLimpo = numero.replace(/\D/g, '');
  if (!numeroLimpo.startsWith('55')) {
    numeroLimpo = '55' + numeroLimpo; // Adiciona o DDI Brasil caso não tenha
  }
  const chatId = `${numeroLimpo}@c.us`;

  // 2. Converter PDF (Buffer -> MessageMedia)
  const pdfBase64 = pdfBuffer.toString('base64');
  const nomeSafe = nome.replace(/\s+/g, '-').toLowerCase();
  const nomeArquivo = `pre-prontuario-${nomeSafe}.pdf`;
  
  const media = new MessageMedia('application/pdf', pdfBase64, nomeArquivo);

  // 3. Montar as mensagens
  const legendaPendente = `📋 *Pré-Prontuário Digital — Encontre Saúde*\nOlá, *${nome}*! Seu documento está em anexo. Apresente-o ao médico na sua consulta. 💚`;
  const textoDicas = [
    `⚕️ *Lembrete importante:*`,
    `Este documento é de caráter informativo e não substitui uma consulta médica presencial.`,
    ``,
    `Em caso de emergência, ligue *SAMU 192* ou dirija-se ao pronto-socorro mais próximo.`,
    ``,
    `_Equipe Encontre Saúde_ 🏥`
  ].join('\n');

  try {
    // 4. Envia o anexo em PDF e a mensagem de apoio textual
    await client.sendMessage(chatId, media, { caption: legendaPendente });
    await client.sendMessage(chatId, textoDicas);
    
    console.log(`✅ [1/1] Anexo via WHATSAPP enviado com sucesso para ${numeroLimpo}`);
    return { success: true };
    
  } catch (error) {
    console.error(`❌ Falha interna ao encaminhar a mensagem para ${numeroLimpo}:`, error);
    throw new Error('Motor da livraria reportou erro ao encaminhar. Verifique se o numero existe no whatsapp.');
  }
}

module.exports = { iniciarWhatsApp, enviarWhatsApp };
