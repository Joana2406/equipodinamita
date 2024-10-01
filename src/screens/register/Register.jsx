import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Éxito', 'Registro completado. Ahora puedes iniciar sesión.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.welcomeText}>¡Regístrate en IAC voice!</Text>
        <Image 
          source={{ uri: 'https://example.com/logo.png' }} // Cambia la URL de la imagen según necesites
          style={styles.logo} 
        />
      </View>
      <View style={styles.formContainer}>
        <TextInput 
          placeholder="Introduce tu correo electrónico" 
          keyboardType="email-address"
          style={styles.input} 
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput 
            placeholder="Introduce la contraseña" 
            secureTextEntry={!passwordVisible}
            style={styles.input} 
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity 
            style={styles.togglePassword} 
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Text>👁</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput 
            placeholder="Confirma la contraseña" 
            secureTextEntry={!passwordVisible}
            style={styles.input} 
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity 
            style={styles.togglePassword} 
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Text>👁</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleRegister} 
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            {loading ? 'Cargando...' : 'REGISTRARSE'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>¿Ya tienes una cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Estilos (se mantienen igual)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 3,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backArrow: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  arrowText: {
    fontSize: 24,
    color: '#000000',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 50,
    marginVertical: 20,
  },
  formContainer: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 30,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  togglePassword: {
    position: 'absolute',
    top: '50%',
    right: 20,
    transform: [{ translateY: -15 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 10,
  },
  loginButtonText: {
    color: '#007bff',
    fontSize: 14,
  },
});

export default Register;
