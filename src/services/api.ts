import axios from 'axios';

const backendURL = 'http://192.168.56.1:3001';

export async function getWeather(city: string) {
  try {
    const response = await axios.get(`${backendURL}/weather`, {
      params: { city },
    });
    return response.data; // Esse é o JSON completo que seu backend envia
  } catch (error) {
    console.error('Erro ao buscar o clima:', error);
    throw error;
  }
}
