/**
 * pdf.builder.js
 * Motor principal de geração do PDF do Pré-Prontuário — Encontre Saúde
 * Retorna um Buffer em memória (nunca salva em disco)
 */

const PDFDocument = require('pdfkit');
const CFG    = require('./pdf.config');
const layout = require('./pdf.layout');

function gerarPDF(dados) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: CFG.pageSize,
        margins: CFG.margins,
        info: {
          Title: `Pré-Prontuário — ${dados.nome || 'Paciente'}`,
          Author: 'Encontre Saúde',
          Subject: 'Pré-Prontuário Digital',
          Keywords: 'saúde, prontuário, triagem',
          CreationDate: new Date(),
        },
        bufferPages: true,
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end',  () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth  = doc.page.width;
      const pageHeight = doc.page.height;

      let y = layout.drawHeader(doc, pageWidth);

      y = layout.drawSectionTitle(doc, 'DADOS PESSOAIS', y, pageWidth);
      y = layout.drawFieldGrid(doc, [
        { label: 'Nome Completo',      value: dados.nome },
        { label: 'Data de Nascimento', value: layout.formatDate(dados.dataNascimento) },
        { label: 'CPF',                value: layout.formatCPF(dados.cpf) },
        { label: 'Sexo',               value: dados.sexo },
        { label: 'Telefone',           value: dados.telefone },
      ], y, pageWidth, 2);

      y = layout.drawSectionTitle(doc, 'QUEIXA PRINCIPAL', y, pageWidth);
      y = layout.drawTextBlock(doc, 'Relato do paciente:', dados.queixaPrincipal, y, pageWidth);

      if (dados.tempoPrincipalSintoma) {
        y = layout.drawFieldGrid(doc, [
          { label: 'Tempo do Sintoma Principal', value: dados.tempoPrincipalSintoma },
        ], y, pageWidth, 1);
      }

      if (dados.sintomas && dados.sintomas.length > 0) {
        y = layout.drawSectionTitle(doc, 'SINTOMAS RELATADOS', y, pageWidth);
        y = layout.drawSintomasTags(doc, dados.sintomas, y, pageWidth);
      }

      y = layout.drawSectionTitle(doc, 'SINAIS VITAIS', y, pageWidth);
      y = layout.drawSinaisVitais(doc, dados, y, pageWidth);

      if (y > pageHeight - 200) { doc.addPage(); y = CFG.margins.top; }

      y = layout.drawSectionTitle(doc, 'HISTORICO CLINICO', y, pageWidth);

      const historicoFields = [];
      if (dados.alergias)             historicoFields.push({ label: 'Alergias',             value: dados.alergias });
      if (dados.medicamentosEmUso)    historicoFields.push({ label: 'Medicamentos em Uso',  value: dados.medicamentosEmUso });
      if (dados.doencasPreexistentes) historicoFields.push({ label: 'Doencas Preexistentes',value: dados.doencasPreexistentes });
      if (dados.historicoFamiliar)    historicoFields.push({ label: 'Historico Familiar',   value: dados.historicoFamiliar });

      if (historicoFields.length > 0) {
        y = layout.drawFieldGrid(doc, historicoFields, y, pageWidth, 2);
      } else {
        y = layout.drawTextBlock(doc, 'Historico Clinico', 'Nenhuma informacao adicional informada.', y, pageWidth);
      }

      if (dados.observacoesAdicionais) {
        y = layout.drawSectionTitle(doc, 'OBSERVACOES ADICIONAIS', y, pageWidth);
        y = layout.drawTextBlock(doc, 'Observacoes:', dados.observacoesAdicionais, y, pageWidth);
      }

      layout.drawFooter(doc, pageWidth, pageHeight);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { gerarPDF };
