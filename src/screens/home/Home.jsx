// src/screens/home/Home.jsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

// Componente para la animación de carga
const LoadingAnimation = () => {
  const animations = Array.from({ length: 5 }, () => new Animated.Value(0));

  useEffect(() => {
    animations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
            delay: index * 200,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.loading}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.loadingBar,
            {
              backgroundColor: ['#F99E17', '#1F1F1F', '#FFFFFF', '#F99E17', '#2196F3'][index],
              transform: [{ scaleY: anim }],
            },
          ]}
        />
      ))}
    </View>
  );
};

// Componente principal de Home
const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LoadingAnimation />
      <Text style={styles.welcomeText}>Bienvenido a IAC su asistente Virtual</Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginButtonText}>Ir a Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101010', // Fondo principal en negro muy oscuro
    padding: 20,
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
    height: 100,
    gap: 6,
  },
  loadingBar: {
    width: 4,
    height: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#FFFFFF', // Texto blanco
  },
  loginButton: {
    backgroundColor: '#F99E17', // Naranja vibrante como el botón de micrófono
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF', // Texto blanco
    fontWeight: 'bold',
  },
});

export default Home;
