// src/screens/chat/ChatDetails.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatDetails = ({ route }) => {
  const { conversationId } = route.params; // Obtener el ID de la conversación

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Conversación {conversationId}</Text>
      {/* Aquí puedes mostrar el historial de mensajes de la conversación */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ChatDetails;
