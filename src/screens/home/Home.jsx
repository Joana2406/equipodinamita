// screens/home/Home.jsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import LoadingAnimation from '../../components/LoadingAnimation';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido a IAC voice</Text>
      <LoadingAnimation />
      <Button 
        title="Iniciar Sesión" 
        onPress={() => navigation.navigate('Login')} 
        color="#1E90FF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default Home;
