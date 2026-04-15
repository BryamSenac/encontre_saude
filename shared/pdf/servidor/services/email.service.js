/**
 * email.service.js
 * Serviço de envio de e-mail com PDF anexado — Nodemailer
 */

const nodemailer = require('nodemailer');

function criarTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

function gerarCorpoEmail(nome) {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:30px 0;">
        <tr><td align="center">
          <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
            <tr>
              <td style="background:#0d3b2e;padding:28px 32px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:22px;">🏥 Encontre Saúde</h1>
                <p style="color:#2aa87f;margin:6px 0 0;font-size:13px;">Pré-Prontuário Digital</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="color:#1a202c;font-size:16px;"><strong>Olá, ${nome}!</strong></p>
                <p style="color:#4a5568;font-size:14px;line-height:1.6;">
                  Seu <strong>Pré-Prontuário Digital</strong> foi gerado com sucesso e está em anexo neste e-mail.
                </p>
                <p style="color:#4a5568;font-size:14px;line-height:1.6;">
                  📋 <strong>Leve-o impresso ou em seu celular</strong> para a sua consulta médica.
                </p>
                <div style="background:#eaf7f2;border-left:4px solid #1a7a5e;border-radius:6px;padding:16px;margin:24px 0;">
                  <p style="margin:0;color:#0d3b2e;font-size:13px;">
                    ⚕️ <em>Este documento é de caráter informativo e não substitui uma consulta médica presencial.</em>
                  </p>
                </div>
                <p style="color:#718096;font-size:13px;">
                  Em caso de emergência, ligue <strong>SAMU 192</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f4f6f8;padding:20px 32px;text-align:center;">
                <p style="color:#718096;font-size:11px;margin:0;">
                  © ${new Date().getFullYear()} Encontre Saúde — Todos os direitos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

async function enviarEmail(destinatario, nome, pdfBuffer) {
  const transporter = criarTransporter();
  await transporter.verify();

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Encontre Saúde" <${process.env.SMTP_USER}>`,
    to: destinatario,
    subject: `Seu Pré-Prontuário Digital — Encontre Saúde`,
    html: gerarCorpoEmail(nome),
    attachments: [
      {
        filename: `pre-prontuario-${nome.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 E-mail enviado para ${destinatario} — ID: ${info.messageId}`);
  return info;
}

module.exports = { enviarEmail };
