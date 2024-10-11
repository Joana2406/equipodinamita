import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { auth } from '../../config/firebaseConfig'; // Asegúrate de importar tu configuración de Firebase

const Verification = ({ route, navigation }) => {
  const { confirmation } = route.params;
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    try {
      await confirmation.confirm(code); // Confirmar el código
      Alert.alert('Éxito', 'Número verificado exitosamente');
      navigation.navigate('Home'); // Navega a la vista de inicio o donde desees
    } catch (error) {
      Alert.alert('Error', 'El código no es válido. Intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Código de verificación"
        style={styles.input}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyButtonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '80%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  verifyButton: {
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Verification;
