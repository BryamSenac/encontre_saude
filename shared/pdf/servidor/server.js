require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prontuarioRoutes = require('./routes/prontuario.routes');
const { iniciarWhatsApp } = require('./services/whatsapp.service');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Encontre Saúde — Servidor',
    timestamp: new Date().toISOString(),
  });
});

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.use('/api', prontuarioRoutes);

// ─── Handler de rotas não encontradas ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada.' });
});

// ─── Handler de erros globais ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno no servidor. Tente novamente.',
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ Encontre Saúde Servidor rodando em http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  
  // Iniciar o motor do WhatsApp no próprio NodeJS
  iniciarWhatsApp();
});
