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
        key: '569ccd4b',
        city_name: city,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar clima:', error.message);
    res.status(500).json({ error: 'Erro ao buscar clima' });
  }
});

// Rota proxy para ícones do HG Brasil
app.get('/weather-icons/:icon', async (req, res) => {
  const iconName = req.params.icon; // Exemplo: clear_day.png
  const key = '569ccd4b'; // Seu token API

  const url = `https://assets.hgbrasil.com/weather/icons/conditions/${iconName}`;

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      params: { key },
    });

    res.setHeader('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    console.error('Erro ao buscar ícone:', error.message);
    res.status(500).send('Erro ao buscar ícone');
  }
});

// Inicia o servidor escutando em 0.0.0.0 para aceitar conexões da rede
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://${getLocalIp()}:${PORT}`);
});
