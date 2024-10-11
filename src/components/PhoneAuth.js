// src/components/PhoneAuth.js
import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import app from '../config/firebaseConfig';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifier = useRef(null);
  const auth = getAuth(app); // Usa la instancia de autenticación

  const sendVerification = async () => {
    try {
      const verifier = new RecaptchaVerifier(recaptchaVerifier.current, {
        size: 'invisible',
        callback: (response) => {
          // El reCAPTCHA fue verificado
        },
      }, auth);

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(confirmation); // Guarda la referencia de confirmación
      Alert.alert('Código de verificación enviado');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const confirmCode = async () => {
    try {
      await confirmationResult.confirm(verificationCode);
      Alert.alert('Teléfono verificado con éxito');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Número de teléfono"
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button title="Enviar código" onPress={sendVerification} />
      <TextInput
        placeholder="Código de verificación"
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
      />
      <Button title="Confirmar código" onPress={confirmCode} />
      <div ref={recaptchaVerifier}></div> {/* reCAPTCHA */}
    </View>
  );
};

export default PhoneAuth;
