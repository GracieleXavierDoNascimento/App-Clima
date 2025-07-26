import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { getWeather } from '../src/services/api';

export default function Home() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeather('Recife,PE');
        console.log('🔥 Clima recebido:', data);
        setWeather(data.results);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível obter os dados climáticos.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Dados climáticos indisponíveis.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.city}>{weather.city}</Text>
        <Image
          source={{ uri: weather.img_id ? `https://assets.hgbrasil.com/weather/icons/conditions/${weather.img_id}.svg` : 'https://img.icons8.com/ios-filled/100/ffffff/cloud.png' }}
          style={styles.icon}
        />
        <Text style={styles.temp}>{weather.temp}°</Text>
        <Text style={styles.description}>{weather.description}</Text>
        <Text style={styles.date}>{weather.date} • {weather.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // azul claro moderno
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    width: '100%',
  },
  city: {
    fontSize: 26,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10,
  },
  icon: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  temp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  description: {
    fontSize: 22,
    color: '#666',
    marginTop: 8,
  },
  date: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  text: {
    fontSize: 18,
    color: '#FFF',
  },
});
