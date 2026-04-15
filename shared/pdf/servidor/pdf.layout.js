/**
 * pdf.layout.js
 * Funções de desenho de cada seção do PDF — Encontre Saúde
 */

const path = require('path');
const fs = require('fs');
const CFG = require('./pdf.config');
const C = CFG.colors;
const F = CFG.fonts;
const S = CFG.spacing;

// ─── Utilitários internos ───────────────────────────────────────────────────

function drawRect(doc, x, y, w, h, color, radius = 0) {
  doc.save().roundedRect(x, y, w, h, radius).fill(color).restore();
}

function safeText(value, fallback = '—') {
  if (value === null || value === undefined || String(value).trim() === '') return fallback;
  return String(value);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

function formatCPF(cpf) {
  if (!cpf) return '—';
  const c = cpf.replace(/\D/g, '');
  return c.length === 11
    ? `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}`
    : cpf;
}

// ─── Cabeçalho ──────────────────────────────────────────────────────────────

function drawHeader(doc, pageWidth) {
  const headerH = 75;

  // Fundo verde escuro
  drawRect(doc, 0, 0, pageWidth, headerH, C.headerBg);
  // Linha de acento na base
  drawRect(doc, 0, headerH, pageWidth, 4, C.primaryLight);

  // Logo — usa logo.png (somente icone, sem texto embutido)
  const logoPath = path.join(__dirname, '../../../assets/logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 30, 10, { height: 54, fit: [54, 54] });
  }

  // Titulo
  doc
    .fillColor(C.white)
    .font('Helvetica-Bold')
    .fontSize(F.title.size)
    .text('ENCONTRE SAUDE', 96, 18, { align: 'left' });

  // Subtitulo
  doc
    .fillColor(C.primaryLight)
    .font('Helvetica')
    .fontSize(F.subtitle.size)
    .text('Pre-Prontuario Digital  |  Documento Confidencial', 96, 44, { align: 'left' });

  // Data e hora (direita)
  const agora = new Date();
  const dataGerada = agora.toLocaleDateString('pt-BR');
  const horaGerada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  doc
    .fillColor(C.mediumGray)
    .font('Helvetica')
    .fontSize(F.footer.size)
    .text(`Gerado em: ${dataGerada} as ${horaGerada}`, 0, 30, {
      align: 'right',
      width: pageWidth - 40,
    });

  return headerH + 4 + S.sectionGap;
}


// ─── Título de Seção ────────────────────────────────────────────────────────

function drawSectionTitle(doc, title, y, pageWidth) {
  const margins = CFG.margins;
  const contentW = pageWidth - margins.left - margins.right;

  // Barra verde de fundo
  drawRect(doc, margins.left, y, contentW, 22, C.primary, 4);

  // Pequeno quadrado branco decorativo (substitui emoji)
  doc.save()
    .roundedRect(margins.left + 10, y + 7, 8, 8, 1)
    .fill(C.white)
    .restore();

  // Texto do título
  doc
    .fillColor(C.white)
    .font('Helvetica-Bold')
    .fontSize(F.sectionHeader.size)
    .text(title, margins.left + 25, y + 6, { width: contentW - 30 });

  return y + 22 + S.fieldGap;
}

// ─── Grid de campos ─────────────────────────────────────────────────────────

function drawFieldGrid(doc, fields, startY, pageWidth, cols = 2) {
  const margins = CFG.margins;
  const contentW = pageWidth - margins.left - margins.right;
  const colW = contentW / cols;
  const rowH = S.lineHeight * 2 + S.fieldGap;

  let y = startY;
  let col = 0;

  const rows = Math.ceil(fields.length / cols);
  drawRect(doc, margins.left, y, contentW, rows * rowH + S.cardPadding, C.sectionBg, 4);

  fields.forEach((field, i) => {
    const x = margins.left + col * colW + S.cardPadding;
    const currentY = y + Math.floor(i / cols) * rowH + S.cardPadding / 2;

    doc
      .fillColor(C.textMuted)
      .font('Helvetica')
      .fontSize(F.fieldLabel.size)
      .text(field.label, x, currentY, { width: colW - S.cardPadding * 2 });

    doc
      .fillColor(C.text)
      .font('Helvetica-Bold')
      .fontSize(F.fieldValue.size)
      .text(safeText(field.value), x, currentY + S.lineHeight, {
        width: colW - S.cardPadding * 2,
        ellipsis: true,
      });

    col = (col + 1) % cols;
  });

  return y + rows * rowH + S.cardPadding + S.sectionGap;
}

// ─── Campo de texto longo ───────────────────────────────────────────────────

function drawTextBlock(doc, label, value, startY, pageWidth) {
  const margins = CFG.margins;
  const contentW = pageWidth - margins.left - margins.right;
  const text = safeText(value);

  const textH = doc.heightOfString(text, {
    width: contentW - S.cardPadding * 2,
    fontSize: F.body.size,
  });
  const blockH = textH + S.lineHeight + S.cardPadding * 2;

  drawRect(doc, margins.left, startY, contentW, blockH, C.sectionBg, 4);

  doc
    .fillColor(C.textMuted)
    .font('Helvetica')
    .fontSize(F.fieldLabel.size)
    .text(label, margins.left + S.cardPadding, startY + S.cardPadding, {
      width: contentW - S.cardPadding * 2,
    });

  doc
    .fillColor(C.text)
    .font('Helvetica')
    .fontSize(F.body.size)
    .text(text, margins.left + S.cardPadding, startY + S.cardPadding + S.lineHeight, {
      width: contentW - S.cardPadding * 2,
    });

  return startY + blockH + S.sectionGap;
}

// ─── Sintomas (chips/tags) ──────────────────────────────────────────────────

function drawSintomasTags(doc, sintomas, startY, pageWidth) {
  if (!sintomas || !sintomas.length) return startY;

  const margins = CFG.margins;
  const contentW = pageWidth - margins.left - margins.right;

  drawRect(doc, margins.left, startY, contentW, 12, C.sectionBg, 4);

  let x = margins.left + S.cardPadding;
  const chipH = 14;
  const chipPad = 8;
  let rowY = startY + S.cardPadding / 2;
  const maxX = pageWidth - margins.right - S.cardPadding;

  sintomas.forEach((sintoma) => {
    const chipW = doc.widthOfString(sintoma, { fontSize: F.fieldLabel.size }) + chipPad * 2;

    if (x + chipW > maxX) {
      x = margins.left + S.cardPadding;
      rowY += chipH + 4;
    }

    drawRect(doc, x, rowY, chipW, chipH, C.primary, chipH / 2);
    doc
      .fillColor(C.white)
      .font('Helvetica')
      .fontSize(F.fieldLabel.size)
      .text(sintoma, x + chipPad, rowY + 2.5, { width: chipW - chipPad, lineBreak: false });

    x += chipW + 6;
  });

  const totalH = rowY + chipH + S.cardPadding - startY;
  drawRect(doc, margins.left, startY, contentW, totalH, C.sectionBg, 4);

  x = margins.left + S.cardPadding;
  rowY = startY + S.cardPadding / 2;
  sintomas.forEach((sintoma) => {
    const chipW = doc.widthOfString(sintoma, { fontSize: F.fieldLabel.size }) + chipPad * 2;
    if (x + chipW > maxX) { x = margins.left + S.cardPadding; rowY += chipH + 4; }
    drawRect(doc, x, rowY, chipW, chipH, C.primary, chipH / 2);
    doc.fillColor(C.white).font('Helvetica').fontSize(F.fieldLabel.size)
      .text(sintoma, x + chipPad, rowY + 2.5, { width: chipW - chipPad, lineBreak: false });
    x += chipW + 6;
  });

  return startY + totalH + S.sectionGap;
}

// ─── Sinais Vitais ──────────────────────────────────────────────────────────

function drawSinaisVitais(doc, dados, startY, pageWidth) {
  const margins = CFG.margins;
  const contentW = pageWidth - margins.left - margins.right;

  const vitais = [
    { label: 'Pressão Arterial', value: safeText(dados.pressaoArterial),    unit: 'mmHg' },
    { label: 'Freq. Cardíaca',   value: safeText(dados.frequenciaCardiaca), unit: 'bpm'  },
    { label: 'Temperatura',      value: safeText(dados.temperatura),         unit: '°C'   },
    { label: 'Saturação O₂',    value: safeText(dados.saturacaoOxigenio),   unit: '%'    },
    { label: 'Peso',             value: safeText(dados.peso),                unit: 'kg'   },
    { label: 'Altura',           value: safeText(dados.altura),              unit: 'cm'   },
  ];

  const cols = 3;
  const colW = contentW / cols;
  const cardH = 36;
  const rows = Math.ceil(vitais.length / cols);
  const blockH = rows * (cardH + 4) + S.cardPadding * 2;

  drawRect(doc, margins.left, startY, contentW, blockH, C.sectionBg, 4);

  vitais.forEach((vital, i) => {
    const col  = i % cols;
    const row  = Math.floor(i / cols);
    const x    = margins.left + col * colW + S.cardPadding;
    const y    = startY + S.cardPadding + row * (cardH + 4);
    const cardW = colW - S.cardPadding * 1.5;

    drawRect(doc, x, y, cardW, cardH, C.white, 4);
    drawRect(doc, x, y, 3, cardH, C.primary, 2);

    doc.fillColor(C.textMuted).font('Helvetica').fontSize(F.fieldLabel.size)
      .text(vital.label, x + 8, y + 5, { width: cardW - 10 });

    const displayValue = vital.value === '—' ? '—' : `${vital.value} ${vital.unit}`;
    doc.fillColor(vital.value === '—' ? C.textMuted : C.text).font('Helvetica-Bold').fontSize(F.fieldValue.size)
      .text(displayValue, x + 8, y + 18, { width: cardW - 16 });
  });

  return startY + blockH + S.sectionGap;
}

// ─── Rodapé ─────────────────────────────────────────────────────────────────

function drawFooter(doc, pageWidth, pageHeight) {
  const y = pageHeight - CFG.margins.bottom + 10;

  doc.moveTo(CFG.margins.left, y).lineTo(pageWidth - CFG.margins.right, y)
    .strokeColor(C.mediumGray).lineWidth(0.5).stroke();

  doc.fillColor(C.textMuted).font('Helvetica').fontSize(F.footer.size)
    .text(
      'Este documento e de carater informativo e nao substitui uma consulta medica presencial. — Encontre Saude',
      CFG.margins.left, y + 6,
      { width: pageWidth - CFG.margins.left - CFG.margins.right, align: 'center' }
    );
}

module.exports = {
  drawHeader, drawSectionTitle, drawFieldGrid,
  drawTextBlock, drawSintomasTags, drawSinaisVitais,
  drawFooter, formatDate, formatCPF,
};
