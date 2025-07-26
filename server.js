// backend.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const os = require('os');

const app = express();
const PORT = 3001;

// Habilita CORS para qualquer origem (liberado geral)
app.use(cors());

// Função para descobrir IP local para log
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Rota para obter o clima de uma cidade
app.get('/weather', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'Parâmetro city é obrigatório' });
    }

    console.log(`[${new Date().toISOString()}] Requisição clima para cidade: ${city}`);

    const response = await axios.get('https://api.hgbrasil.com/weather', {
      params: {
        key: 'ba94c742',
        city_name: city,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar clima:', error.message);
    res.status(500).json({ error: 'Erro ao buscar clima' });
  }
});

// Inicia o servidor escutando em 0.0.0.0 para aceitar conexões da rede
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://${getLocalIp()}:${PORT}`);
});
