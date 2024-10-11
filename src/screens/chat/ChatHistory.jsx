import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatHistory = ({ onSelectConversation }) => {
    const navigation = useNavigation(); // Para manejar la navegación

    // Datos de ejemplo para las conversaciones
    const conversations = [
        { id: 1, title: 'Conversación 1' },
        { id: 2, title: 'Conversación 2' },
        // Añade más conversaciones según sea necesario
    ];

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onSelectConversation(item.id)}>
                        <Text style={styles.conversation}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            <Button 
                title="Nueva Conversación" 
                onPress={() => {
                    // Aquí podrías manejar la lógica para crear una nueva conversación si es necesario
                    navigation.navigate('Chat'); // Redirige a la pantalla de Chat
                }} 
                color="#5F0F40" // Cambia el color según tu tema
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#0A1E1E',
    },
    conversation: {
        color: '#FFFFFF',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#5F0F40',
    },
});

export default ChatHistory;
