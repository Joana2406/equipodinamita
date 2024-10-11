import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { auth } from '../../config/firebaseConfig'; // Asegúrate de tener Firebase configurado
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth'; // Métodos de Firebase para actualizar perfil

const Settings = ({ navigation }) => { // Asegúrate de recibir la prop navigation
    const [name, setName] = useState(auth.currentUser.displayName || '');
    const [email, setEmail] = useState(auth.currentUser.email || '');
    const [phone, setPhone] = useState(''); // Suponiendo que el número de teléfono se almacena en otro lugar
    const [password, setPassword] = useState('');
    const [imageUri, setImageUri] = useState(null); // Lógica para cambiar la foto (puedes usar una librería para seleccionar imágenes)

    const handleSaveProfile = async () => {
        try {
            // Actualizar el nombre
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, { displayName: name });
            }

            // Actualizar el correo
            if (auth.currentUser.email !== email) {
                await updateEmail(auth.currentUser, email);
            }

            // Actualizar la contraseña si se proporciona
            if (password) {
                await updatePassword(auth.currentUser, password);
            }

            // Aquí puedes manejar la lógica para actualizar el número de teléfono si se necesita

            Alert.alert("Perfil actualizado", "Tu perfil ha sido actualizado correctamente.");
            navigation.navigate('Chat'); // Navegar de regreso a la pantalla de chat
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            Alert.alert("Error", "Hubo un problema al actualizar tu perfil.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Configuración de Perfil</Text>
            
            <View style={styles.profileImageContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.profileImage} />
                ) : (
                    <View style={styles.placeholderImage} />
                )}
                <TouchableOpacity onPress={() => { /* Lógica para seleccionar una nueva imagen */ }}>
                    <Text style={styles.changeImageText}>Cambiar imagen</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Número de teléfono"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña (dejar en blanco para no cambiar)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#0A1E1E',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#CCCCCC',
        marginBottom: 10,
    },
    changeImageText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    saveButton: {
        backgroundColor: '#273826',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default Settings;
