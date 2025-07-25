import axios from 'axios';

const isWeb = typeof window !== 'undefined';

// Altere para o IP local da sua máquina na rede, ou localhost se rodar só no web
const localProxyBaseURL = 'http://localhost:3001';

export const getWeather = async (city: string) => {
  const baseUrl = isWeb
    ? localProxyBaseURL // usa proxy local para evitar CORS no navegador
    : 'https://api.hgbrasil.com'; // direto para mobile e desktop

  const response = await axios.get(`${baseUrl}/weather`, {
    // No proxy local não precisa desses headers extras
    headers: isWeb ? undefined : undefined,
    params: isWeb
      ? { city } // proxy local espera "city" no query
      : {
          key: 'ba94c742',
          city_name: city,
        },
  });

  // Se estiver no proxy local, os dados estão no response.data.results (igual API)
  return response.data.results;
};
