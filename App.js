import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, ImageBackground, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [donner, setDonner] = useState(null);
  const key = "10a821a76b82c4764c7c454ed45ce703"; 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);




  function weatherBalloon() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`)
      .then(function(resp) { return resp.json(); }) 
      .then(function(data) {
        setWeatherData(data);
        console.log(data);
      })
      .catch(function() {
        console.log('Error fetching weather data');
      });
  }

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      weatherBalloon();
    }
  }, [latitude, longitude]);

  function formatForecastTime(timestamp) {
    const date = new Date(timestamp * 1000); // Convertir le timestamp en millisecondes
    const hours = date.getHours().toString().padStart(2, '0'); // Ajouter un zéro en tête si nécessaire
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ajouter un zéro en tête si nécessaire
    return `${hours}:${minutes}`;
  }

  function weatherPrev(){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`)
    .then(function(respPrev) { return respPrev.json(); }) 
    .then(function(donner) {
      setDonner(donner);
      console.log(donner);
    })
    .catch(function() {
      console.log('Error fetching weather data Preview');
    });
  }
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      weatherPrev();
    }
  }, [latitude, longitude]);


  const image = {uri: 'https://i.imgur.com/3940hBQ.jpeg'};
  return (
    <View style={styles.container}>
      <ImageBackground blurRadius={20} source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.overlay}>
          {weatherData && (
            <View>
              <Text style={styles.topLeftText}>{weatherData.name}</Text>
              <Image style={styles.imageIcon} source={{ uri: `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png` }} />
              <Text style={styles.text}>{weatherData.main.temp} °C</Text>
              <Text style={styles.textExp}>{weatherData.weather[0].description}</Text>
            </View>
          )}

              
      {donner && donner.list && (
      <View style={styles.forecastContainer}>
        <ScrollView horizontal style={styles.scrollView}>
          {donner.list.slice(0, 35).map((forecast, index) => (
            <View horizontal key={index} style={styles.forecastBlock}>
             <Text style={styles.forecastText}>{formatForecastTime(forecast.dt)}</Text>
              <Image style={styles.imageIconPrev} source={{ uri: `http://openweathermap.org/img/w/${donner.list[index].weather[0].icon}.png` }} />
              <Text style={styles.forecastText}>{forecast.main.temp} °C</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    )}

        </View>
        <StatusBar style="light" />
      </ImageBackground>
    </View>
  );
} 

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  imageIcon: {
    marginTop: 40,
    width: windowWidth * 0.6, 
    height: windowWidth * 0.6, 
  },

  imageIconPrev: {
    width: windowWidth * 0.3, 
    height: windowWidth * 0.3, 
  },

  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
    height: windowHeight,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
    margin: 5,
  },

  textExp: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
    margin: 5,
    marginBottom: 100,
  },

  topLeftText: {
    position: 'absolute',
    top: -20, 
    alignSelf: 'center',
    left: -70,
    color: '#fff',
    fontSize: 30,
    zIndex: 1, 
  },

  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  forecastBlock: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  forecastText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    margin: 5,
  },

  forecastIcon: {
    width: 50,
    height: 50,
  },
});
