import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getWeather } from '../services/api'; // ajuste o caminho conforme seu projeto

export default function Home() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await getWeather('Recife,PE');
        setWeather(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar o clima.');
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar dados do clima.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{weather.city_name}</Text>
      <Text style={styles.temp}>{weather.temp}ºC</Text>
      <Text style={styles.description}>{weather.description}</Text>
      <Text style={styles.date}>{weather.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loading: {
    backgroundColor: '#fff',
  },
  city: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 50,
    marginTop: 10,
  },
  description: {
    fontSize: 20,
    marginTop: 10,
    textTransform: 'capitalize',
  },
  date: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
