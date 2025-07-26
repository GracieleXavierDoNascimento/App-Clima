import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import { getWeather } from '../src/services/api';

const BACKEND_URL = 'http://192.168.56.1:3001';

export default function Home() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Recife,PE');
  const [searchText, setSearchText] = useState('');

  // Mapear o condition_slug para o nome exato do arquivo do ícone no backend proxy
  const mapConditionToIcon = (condition: string) => {
    const map: Record<string, string> = {
      storm: 'storm.png',
      snow: 'snow.png',
      hail: 'hail.png',
      rain: 'rain.png',
      fog: 'fog.png',
      clear_day: 'clear_day.png',
      clear_night: 'clear_night.png',
      cloudy: 'cloudy_day.png',
      cloudly: 'cloudy_day.png', // corrigido typo original cloudly -> cloudy_day
      cloudly_day: 'cloudy_day.png',
      cloudly_night: 'cloudy_night.png',
      partlycloudy_day: 'partly_cloudy_day.png',
      partlycloudy_night: 'partly_cloudy_night.png',
    };
    return map[condition] || 'clear_day.png'; // fallback
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const data = await getWeather(city);
      setWeather(data.results);
    } catch (error) {
      console.error('Erro ao buscar clima:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const intervalId = setInterval(fetchWeather, 60000);
    return () => clearInterval(intervalId);
  }, [city]);

  const handleSearch = () => {
    if (searchText.trim()) {
      setCity(searchText.trim());
      setSearchText('');
      Keyboard.dismiss();
    }
  };

  if (loading || !weather) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF9E1B" />
      </View>
    );
  }

  const forecast = weather.forecast ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Digite a cidade (ex: Recife,PE)"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.city}>{weather.city_name}</Text>
      <Text style={styles.date}>
        {new Date().toLocaleDateString('pt-BR')} -{' '}
        {new Date().toLocaleTimeString('pt-BR')}
      </Text>

      {/* Card central com ícone, temperatura e descrição */}
      <View style={styles.mainCard}>
        <Image
          style={styles.icon}
          source={{
            uri: `${BACKEND_URL}/weather-icons/${mapConditionToIcon(weather.condition_slug)}`,
          }}
        />
        <Text style={styles.temp}>{weather.temp}°C</Text>
        <Text style={styles.description}>{weather.description}</Text>
      </View>

      {/* Informações adicionais */}
      <View style={styles.extraInfo}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Sensação</Text>
          <Text style={styles.infoValue}>{weather.feels_like}°C</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Umidade</Text>
          <Text style={styles.infoValue}>{weather.humidity}%</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Vento</Text>
          <Text style={styles.infoValue}>{weather.wind_speedy}</Text>
        </View>
      </View>

      {/* Previsão dos próximos dias */}
      <Text style={styles.forecastTitle}>Próximos dias</Text>
      {forecast.length > 1 ? (
        <FlatList
          data={forecast.slice(1, 6)}
          keyExtractor={(item) => item.date}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ width: '100%', paddingBottom: 20 }}
          renderItem={({ item }) => {
            const iconUri = `${BACKEND_URL}/weather-icons/${mapConditionToIcon(item.condition)}`;
            return (
              <View style={styles.dayBox}>
                <Text style={styles.dayName}>{item.weekday}</Text>
                <Image style={styles.dayIcon} source={{ uri: iconUri }} />
                <Text style={styles.dayTemp}>
                  {item.max}° / {item.min}°
                </Text>
                <Text style={styles.dayDesc}>{item.description}</Text>
              </View>
            );
          }}
        />
      ) : (
        <Text style={{ color: 'white', marginTop: 20 }}>
          Previsão não disponível
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101426',
    padding: 20,
    alignItems: 'center',
    paddingTop: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#1E2233',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#fff',
    height: 44,
    marginRight: 8,
  },
  button: {
    backgroundColor: '#FF9E1B',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#101426',
    fontWeight: 'bold',
  },
  city: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 10,
  },
  mainCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  temp: {
    fontSize: 64,
    color: '#FF9E1B',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    color: '#fff',
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  extraInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '100%',
  },
  infoBox: {
    backgroundColor: '#1E2233',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  infoTitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastTitle: {
    color: '#FF9E1B',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 30,
    marginBottom: 10,
  },
  dayBox: {
    backgroundColor: '#1E2233',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  dayIcon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  dayTemp: {
    color: '#FF9E1B',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  dayDesc: {
    color: '#ccc',
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
});
