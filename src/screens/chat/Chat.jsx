import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Animated, TouchableWithoutFeedback } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el icono
import axios from 'axios'; // Asegúrate de tener axios importado

const Chat = ({ navigation, onLogout }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuAnimation] = useState(new Animated.Value(-300));
    const [loading, setLoading] = useState(false); // Agregar el estado de carga

    const handleSend = async () => {
        if (inputText.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: inputText,
                sender: 'user',
            };

            // Solo agregar el mensaje del usuario una vez
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInputText(''); // Limpiar el campo de entrada
            setLoading(true);

            try {
                console.log('Enviando solicitud...');
                const response = await axios.post('http://localhost:1234/invoke', {
                    prompt: inputText,
                });
                console.log('Respuesta del servidor:', response.data);

                // Solo agregar la respuesta del bot una vez
                const botResponse = {
                    id: Date.now().toString(),
                    text: response.data.response,
                    sender: 'bot',
                };

                setMessages((prevMessages) => [...prevMessages, botResponse]); // Actualizar el estado solo con la respuesta del bot
            } catch (error) {
                console.error('Error al recibir la respuesta:', error);

                // Si hay un error, agregar un mensaje de error del bot
                const errorMessage = {
                    id: Date.now().toString(),
                    text: 'Error al recibir la respuesta del servidor.',
                    sender: 'bot',
                };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.nativeEvent.key === 'Enter') {
            // Prevenir el comportamiento predeterminado del formulario
            event.preventDefault();
            handleSend();
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            onLogout(navigation);
        } catch (error) {
            console.error(error.message);
        }
    };

    const renderMessage = ({ item }) => {
        const isUser = item.sender === 'user'; // Identificar si el mensaje es del usuario
        return (
            <View style={isUser ? styles.userMessageContainer : styles.botMessageContainer}>
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    const toggleMenu = () => {
        const toValue = menuVisible ? -300 : 0; // Determina el valor objetivo basado en el estado actual
        Animated.timing(menuAnimation, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setMenuVisible(!menuVisible)); // Cambiar el estado después de la animación
    };

    const handleTouchOutsideMenu = () => {
        if (menuVisible) {
            toggleMenu();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={handleTouchOutsideMenu}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                        <Text style={styles.menuText}>☰</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Chat IAC</Text>
                </View>

                <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuAnimation }] }]}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => {
                        setMessages([]); // Limpiar mensajes para nueva conversación
                        toggleMenu();
                    }}>
                        <Text style={styles.menuItemText}>Nueva conversación</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => {
                        toggleMenu();
                        navigation.navigate('ChatHistory'); // Navegar al historial de chat
                    }}>
                        <Text style={styles.menuItemText}>Historial del chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => {
                        toggleMenu();
                        navigation.navigate('Settings'); // Navegar a la configuración
                    }}>
                        <Text style={styles.menuItemText}>Configuración</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </Animated.View>

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
                        <Icon name="send" size={24} color="#FFFFFF" /> {/* Icono de enviar */}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.micButton} onPress={() => { /* Aquí puedes manejar la función de voz */ }}>
                        <Icon name="microphone" size={24} color="#273826" /> {/* Icono de micrófono */}
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1E1E', // Fondo del chat oscuro
    },
    header: {
        backgroundColor: '#0A1E1E', // Fondo de la cabecera
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#5F0F40',
        position: 'relative',
    },
    menuButton: {
        position: 'absolute',
        left: 15,
    },
    menuText: {
        fontSize: 24,
        color: '#FFFFFF', // Texto en blanco para visibilidad
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF', // Texto en blanco para visibilidad
    },
    messageList: {
        flex: 1,
        padding: 10,
    },
    userMessageContainer: {
        backgroundColor: '#323841', // Fondo de mensajes del usuario
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        alignSelf: 'flex-end',
        maxWidth: '80%',
    },
    botMessageContainer: {
        backgroundColor: '#212227', // Fondo de mensajes del bot
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        alignSelf: 'flex-start',
        maxWidth: '80%',
        borderColor: '#800200', // Borde rojo oscuro para destacar
        borderWidth: 1,
    },
    messageText: {
        color: '#FFFFFF', // Texto blanco para visibilidad
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#5F0F40', // Línea superior en púrpura oscuro
        padding: 10,
        backgroundColor: '#0A1E1E', // Fondo del input en verde azulado
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#FFFFFF', // Borde blanco para resaltar
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        backgroundColor: '#FFFFFF', // Fondo blanco para visibilidad
    },
    sendButton: {
        backgroundColor: '#273826', // Botón de enviar en verde oscuro
        borderRadius: 30,
        padding: 10,
        marginRight: 10,
    },
    micButton: {
        marginLeft: 10,
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 300,
        height: '100%',
        backgroundColor: '#05161A', // Fondo del menú en azul marino oscuro
        padding: 20,
        borderRightWidth: 1,
        borderColor: '#5F0F40',
        zIndex: 1000,
    },
    menuItem: {
        paddingVertical: 15,
    },
    menuItemText: {
        fontSize: 16,
        color: '#FFFFFF', // Texto blanco en el menú
    },
    closeButton: {
        marginTop: 20,
        padding: 15,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#5F0F40', // Línea superior en púrpura oscuro
    },
    closeButtonText: {
        fontSize: 16,
        color: '#FF4D4D', // Texto rojo para el botón de cerrar
    },
});

export default Chat;
