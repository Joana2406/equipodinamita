import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import ChatHistory from './ChatHistory'; // Asegúrate de que la ruta sea correcta

const ChatScreen = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    const handleSelectConversation = (id) => {
        setSelectedConversation(id);
        // Cargar mensajes de la conversación seleccionada
        const conversationMessages = [
            { id: 1, text: 'Hola' },
            { id: 2, text: '¿Cómo estás?' },
        ];
        setMessages(conversationMessages); // Reemplaza con la carga real
    };

    return (
        <View style={styles.container}>
            {selectedConversation === null ? (
                <ChatHistory onSelectConversation={handleSelectConversation} />
            ) : (
                <View>
                    <Button title="Volver al Historial" onPress={() => setSelectedConversation(null)} />
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => <Text style={styles.message}>{item.text}</Text>}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#0A1E1E',
    },
    message: {
        color: '#FFFFFF',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#5F0F40',
    },
});

export default ChatScreen;
