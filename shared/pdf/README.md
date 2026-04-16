# 📄 Módulo de Geração de PDF — Encontre Saúde

Esta pasta contém todos os arquivos responsáveis pela geração de PDFs do sistema.

## Estrutura

```
shared/pdf/
├── pdf.config.js          # Configurações globais do PDF (cores, fontes, margens)
├── pdf.builder.js          # Motor principal: monta o PDF com PDFKit
├── pdf.layout.js          # Layout/template: posicionamento dos elementos no documento
└── README.md              # Este arquivo
```

## Como funciona

1. O **backend** (Express) chama `pdf.builder.js` passando os dados do pré-prontuário.
2. O builder usa o `pdf.layout.js` para desenhar cada seção do documento.
3. O PDF é gerado **em memória** (Buffer) — nunca salvo em disco.
4. O Buffer é passado diretamente para o serviço de envio (e-mail ou WhatsApp).

## Tecnologia
- `pdfkit` — versão Node.js (backend)
- Geração 100% server-side, sem dependências de browser
