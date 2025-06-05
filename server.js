const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Статические файлы из Next.js build
app.use(express.static(path.join(__dirname, '.next/static'), {
  maxAge: '1y',
  immutable: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// API роуты (если есть)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API not implemented yet' });
});

// Все остальные роуты направляем на index.html (SPA mode)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.next/server/app/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Vaults.cc сервер запущен на порту ${PORT}`);
  console.log(`📱 Откройте http://localhost:${PORT} для просмотра`);
});

module.exports = app; 