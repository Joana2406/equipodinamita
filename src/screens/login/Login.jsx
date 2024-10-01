import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Keyboard, Modal } from 'react-native';
import { signOut } from 'firebase/auth'; // Asegúrate de importar el método de cierre de sesión
import { auth } from '../../config/firebaseConfig'; // Asegúrate de tener la configuración de Firebase

const Chat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: inputText, isUser: true }]);
      setInputText('');
      Keyboard.dismiss();

      // Simular respuesta del bot
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: Date.now().toString(), text: 'Respuesta automática del asistente.', isUser: false },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Enter') {
      handleSend();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Redirigir a la pantalla de login después de cerrar sesión
    } catch (error) {
      console.error(error.message);
    }
  };

  const renderMessage = ({ item }) => {
    return (
      <View style={item.isUser ? styles.userMessageContainer : styles.botMessageContainer}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Chat con IAC Voice</Text>
      </View>

      {/* Menú desplegable */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { 
              handleLogout(); 
              setMenuVisible(false);
          }}>
            <Text style={styles.menuItemText}>Cerrar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            // Aquí puedes navegar a la pantalla de historial de chat
            setMenuVisible(false);
            navigation.navigate('ChatHistory'); // Cambia esto si tienes una pantalla de historial
          }}>
            <Text style={styles.menuItemText}>Historial del chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setMenuVisible(false)}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={inputText}
          onChangeText={setInputText}
          onKeyPress={handleKeyPress}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFF0', // Color de fondo
  },
  header: {
    backgroundColor: '#6C7476', // Color del encabezado
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    left: 15,
  },
  menuText: {
    fontSize: 24,
    color: '#FFFFFF', // Color del texto del menú
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // Color del texto del encabezado
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  userMessageContainer: {
    backgroundColor: '#F99E17', // Color del mensaje del usuario
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  botMessageContainer: {
    backgroundColor: '#8FADAD', // Color del mensaje del asistente
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderColor: '#6C7476',
    borderWidth: 1,
  },
  messageText: {
    color: '#000303', // Color del texto de los mensajes
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
    backgroundColor: '#FFFFFF', // Color de fondo del input
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6C7476', // Color del borde del input
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#EDEFF0', // Color de fondo del input
  },
  sendButton: {
    backgroundColor: '#F99E17', // Color del botón de enviar
    borderRadius: 30,
    padding: 10,
  },
  sendButtonText: {
    color: '#FFFFFF', // Color del texto del botón de enviar
    fontWeight: 'bold',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    // Añadir altura mínima para el menú
    minHeight: 100,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000303',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#F99E17',
    fontWeight: 'bold',
  },
});

export default Chat;
