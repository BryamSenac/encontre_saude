/**
 * prontuario.controller.js
 * Orquestração: PDF → E-mail ou WhatsApp
 *
 * Localização: shared/pdf/servidor/controllers/
 * pdf.builder.js está em: shared/pdf/pdf.builder.js
 * Caminho relativo: ../../pdf.builder
 */

const { gerarPDF }       = require('../pdf.builder');
const { enviarEmail }    = require('../services/email.service');
const { enviarWhatsApp } = require('../services/whatsapp.service');

async function criarProntuario(req, res) {
  const dados = req.body;

  // ── 1. Gerar o PDF em memória ──────────────────────────────────────────────
  let pdfBuffer;
  try {
    pdfBuffer = await gerarPDF(dados);
    console.log(`📄 PDF gerado com sucesso — ${pdfBuffer.length} bytes`);
  } catch (err) {
    console.error('❌ Erro ao gerar o PDF:', err);
    return res.status(500).json({
      success: false,
      message: 'Erro ao gerar o Pré-Prontuário. Tente novamente.',
    });
  }

  // ── 2. Enviar pelo canal escolhido ─────────────────────────────────────────
  try {
    // ── Download direto ──────────────────────────────────────────────────────
    if (dados.canalEnvio === 'download') {
      const nomeSafe = (dados.nome || 'paciente').replace(/\s+/g, '-').toLowerCase();
      console.log(`⬇️  PDF pronto para download — ${pdfBuffer.length} bytes`);
      return res.status(200).json({
        success: true,
        download: true,
        message: 'PDF gerado! O download iniciará automaticamente.',
        pdf: pdfBuffer.toString('base64'),
        filename: `pre-prontuario-${nomeSafe}.pdf`,
      });
    }

    if (dados.canalEnvio === 'email') {
      await enviarEmail(dados.email, dados.nome, pdfBuffer);
      return res.status(200).json({
        success: true,
        message: `Pré-Prontuário enviado com sucesso para ${dados.email}! Verifique sua caixa de entrada.`,
      });
    }

    if (dados.canalEnvio === 'whatsapp') {
      await enviarWhatsApp(dados.whatsapp, dados.nome, pdfBuffer);
      return res.status(200).json({
        success: true,
        message: `Pré-Prontuário enviado com sucesso para o WhatsApp! Verifique suas mensagens.`,
      });
    }

    return res.status(400).json({ success: false, message: 'Canal de envio inválido.' });

  } catch (err) {
    console.error(`❌ Erro ao enviar via ${dados.canalEnvio}:`, err.message);

    const mensagemErro =
      dados.canalEnvio === 'email'
        ? 'Não foi possível enviar o e-mail. Verifique o endereço ou tente via WhatsApp.'
        : 'Não foi possível enviar pelo WhatsApp. Verifique o número ou tente via e-mail.';

    return res.status(503).json({ success: false, message: mensagemErro });
  }
}

module.exports = { criarProntuario };
