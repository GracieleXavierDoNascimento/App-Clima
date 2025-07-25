import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      const response = await axios.get('https://api.hgbrasil.com/weather', {
        params: {
          key: 'ba94c742',
          city_name: 'Recife,PE',
        },
      });
      setWeather(response.data.results);
      setLoading(false);
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#57B0F3' }]}>
      <View style={styles.topSection}>
        <Ionicons name="location-outline" size={24} color="white" />
        <Text style={styles.city}>{weather.city_name}</Text>
      </View>

      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/869/869869.png' }}
        style={styles.icon}
      />

      <Text style={styles.temp}>{weather.temp}ºC</Text>
      <Text style={styles.condition}>{weather.description}</Text>
      <Text style={styles.date}>{weather.date}</Text>

      {/* Aqui podemos adicionar o ForecastList com os cards */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  city: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },
  temp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
  },
  condition: {
    fontSize: 22,
    color: 'white',
    marginTop: 5,
  },
  date: {
    color: '#eee',
    fontSize: 16,
    marginTop: 8,
  },
  icon: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});
