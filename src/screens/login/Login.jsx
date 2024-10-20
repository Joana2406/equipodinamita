import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Alert } from 'react-native';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebaseConfig'; // Asegúrate de tener la configuración de Firebase
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

const Login = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userToken = userCredential.user.uid; // Usar el UID del usuario como token
      await AsyncStorage.setItem('userToken', userToken); // Guarda el token en AsyncStorage
      console.log('Token guardado:', userToken); // Verifica que el token se guarde
      setIsAuthenticated(true); // Cambia el estado a autenticado
      navigation.navigate('Chat'); // Navegar a la pantalla de chat después del login exitoso
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Error', error.message); // Manejo de errores
    }
  };

  // Manejo del login con Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userToken = result.user.uid; // Usar el UID del usuario como token
      await AsyncStorage.setItem('userToken', userToken); // Guarda el token en AsyncStorage
      console.log('Token de Google guardado:', userToken); // Verifica que el token se guarde
      setIsAuthenticated(true); // Cambia el estado a autenticado
      navigation.navigate('Chat'); // Navegar a la pantalla de chat
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Error', error.message); // Manejo de errores
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Iniciar Sesión</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          onSubmitEditing={() => Keyboard.dismiss()}
          placeholderTextColor="#A5A5A5" // Color de placeholder
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
          placeholderTextColor="#A5A5A5" // Color de placeholder
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        
        {/* Botón para iniciar sesión con Google */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Text style={styles.googleButtonText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate aquí.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Centra horizontalmente
    backgroundColor: '#1E1E1E', // Fondo oscuro similar al chat
  },
  formContainer: {
    width: '90%', // Ancho del formulario
    maxWidth: 400, // Máximo ancho del formulario
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#2E2E2E', // Color gris oscuro para el fondo del formulario
    shadowColor: '#000', // Sombra para dar efecto de elevación
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Elevación en Android
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF', // Texto en blanco para buen contraste
  },
  input: {
    height: 50,
    borderColor: '#3E3E3E', // Borde gris oscuro
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#3A3A3A', // Fondo oscuro para los inputs
    color: '#FFFFFF', // Texto en blanco dentro de los inputs
  },
  loginButton: {
    backgroundColor: '#FF6A00', // Naranja vibrante para el botón de iniciar sesión
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10, // Espacio entre el botón y el enlace de registro
  },
  loginButtonText: {
    color: '#FFFFFF', // Texto en blanco para el botón de iniciar sesión
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#4285F4', // Color de Google (azul)
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10, // Espacio entre el botón y el enlace de registro
  },
  googleButtonText: {
    color: '#FFFFFF', // Texto en blanco para el botón de Google
    fontWeight: 'bold',
  },
  registerLink: {
    alignItems: 'center', // Centra el enlace
  },
  registerText: {
    color: '#FF6A00', // Naranja vibrante para el texto del registro
    textAlign: 'center',
    marginTop: 10, // Espacio entre el botón y el texto del registro
  },
});

export default Login;