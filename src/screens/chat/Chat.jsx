import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Animated, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Chat = ({ navigation, onLogout }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuAnimation] = useState(new Animated.Value(-300));
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null); // Nuevo estado para el modelo seleccionado

    const aiModels = [
        {
            name: "Llama 3.1 405B Instruct",
            modelId: "meta.llama3-1-405b-instruct-v1:0",
            region: "us-west-2",
            body: {
                max_gen_len: 512,
                temperature: 0.5,
                top_p: 0.9,
            }
        },
        {
            name: "Llama 3.1 70B Instruct",
            modelId: "meta.llama3-1-70b-instruct-v1:0",
            region: "us-west-2",
            body: {
                max_gen_len: 512,
                temperature: 0.5,
                top_p: 0.9
            }
        },
        {
            name: "Amazon Titan Text G1 Express",
            modelId: "amazon.titan-text-express-v1",
            region: "us-east-1",
            body: {
                textGenerationConfig: {
                    maxTokenCount: 8192,
                    temperature: 0,
                    topP: 1
                }
            }
        }
    ];

    const handleSend = async () => {
        if (inputText.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: inputText,
                sender: 'user',
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInputText('');
            setLoading(true);

            try {
                // Llamada al backend para obtener la respuesta de IA
                const response = await axios.post('http://localhost:1234/invoke', {
                    prompt: inputText,
                    model: selectedModel // Enviar el modelo seleccionado al backend
                });

                const botResponse = {
                    id: Date.now().toString(),
                    text: response.data.response,
                    sender: 'bot',
                };

                setMessages((prevMessages) => [...prevMessages, botResponse]);
            } catch (error) {
                console.error('Error al recibir la respuesta:', error);
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

    const toggleMenu = () => {
        const toValue = menuVisible ? -300 : 0;
        Animated.timing(menuAnimation, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setMenuVisible(!menuVisible));
    };

    const handleTouchOutsideMenu = () => {
        if (menuVisible) {
            toggleMenu();
        }
    };

    const handleSelectModel = (model) => {
        setSelectedModel(model);
        toggleMenu();
    };

    return (
        <TouchableWithoutFeedback onPress={handleTouchOutsideMenu}>
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                keyboardVerticalOffset={100}
            >
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

                    {/* Nuevas opciones para seleccionar modelo de IA */}
                    <Text style={styles.menuSectionTitle}>Modelos de IA:</Text>
                    {aiModels.map((model) => (
                        <TouchableOpacity key={model.modelId} style={styles.menuItem} onPress={() => handleSelectModel(model.modelId)}>
                            <Text style={styles.menuItemText}>{model.name}</Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.messageContainer}>
                    <ScrollView 
                        contentContainerStyle={styles.messageList}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        style={styles.scrollView}
                    >
                        {messages.map((message) => (
                            <View key={message.id} style={message.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer}>
                                <Text style={styles.messageText}>{message.text}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

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
                        <Icon name="send" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.micButton} onPress={() => { /* Manejar función de voz aquí */ }}>
                        <Icon name="microphone" size={24} color="#273826" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1E1E',
    },
    header: {
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0A1E1E',
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#5F0F40',
        zIndex: 1,
    },
    menuButton: {
        position: 'absolute',
        left: 15,
    },
    menuText: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    messageContainer: {
        flex: 1,
        marginTop: 60, 
        paddingHorizontal: 10, 
        paddingBottom: 60,
        height: height - 150, 
    },
    messageList: {
        flexGrow: 1,
        paddingBottom: 10,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    userMessageContainer: {
        backgroundColor: '#323841',
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        alignSelf: 'flex-end',
        maxWidth: '75%', // Reduce el ancho máximo
    },
    botMessageContainer: {
        backgroundColor: '#212227',
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        alignSelf: 'flex-start',
        maxWidth: '75%', // Reduce el ancho máximo
    },
    messageText: {
        color: '#FFFFFF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#0A1E1E',
        borderTopWidth: 1,
        borderTopColor: '#5F0F40',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    input: {
        flex: 1,
        backgroundColor: '#323841',
        borderRadius: 15,
        padding: 10,
        marginRight: 10,
        color: '#FFFFFF',
    },
    sendButton: {
        marginRight: 10,
    },
    micButton: {
        marginLeft: 10,
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: 300,
        backgroundColor: '#0A1E1E',
        padding: 20,
        borderRightWidth: 1,
        borderRightColor: '#5F0F40',
        zIndex: 10,
    },
    menuItem: {
        paddingVertical: 10,
    },
    menuItemText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    menuSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginVertical: 10,
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#5F0F40',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default Chat;
