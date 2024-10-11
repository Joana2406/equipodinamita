import React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';

const ChatMessages = ({ conversation, onBack }) => {
    if (!conversation) {
        return <Text style={styles.errorText}>No hay conversación seleccionada.</Text>;
    }

    const renderMessage = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Button title="Volver" onPress={onBack} />
            <Text style={styles.title}>Conversación {conversation.id}</Text>
            <FlatList
                data={conversation.messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1E1E',
        padding: 20,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 10,
    },
    messageContainer: {
        padding: 15,
        borderRadius: 8,
        marginVertical: 5,
        backgroundColor: '#5F0F40', // Color para los mensajes
    },
    messageText: {
        color: '#FFFFFF',
    },
    errorText: {
        color: '#FF0000',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ChatMessages;
