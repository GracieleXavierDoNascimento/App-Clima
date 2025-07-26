const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/weather', async (req, res) => {
  try {
    const { city } = req.query;
    const response = await axios.get('https://api.hgbrasil.com/weather', {
      params: {
        key: 'ba94c742',
        city_name: city,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clima' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
