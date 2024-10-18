import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../config/firebaseConfig';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';

const Settings = ({ navigation }) => {
    const [name, setName] = useState(auth.currentUser.displayName || '');
    const [email, setEmail] = useState(auth.currentUser.email || '');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [imageUri, setImageUri] = useState(null);

    // Cargar la imagen almacenada al montar el componente
    useEffect(() => {
        const loadImage = async () => {
            const storedImageUri = await AsyncStorage.getItem('profileImage');
            if (storedImageUri) {
                setImageUri(storedImageUri);
            }
        };

        loadImage();
    }, []);

    const handleSaveProfile = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, { displayName: name });
            }
            if (auth.currentUser.email !== email) {
                await updateEmail(auth.currentUser, email);
            }
            if (password) {
                await updatePassword(auth.currentUser, password);
            }
            // Guardar la URI de la imagen en Async Storage
            if (imageUri) {
                await AsyncStorage.setItem('profileImage', imageUri);
            }
            Alert.alert("Perfil actualizado", "Tu perfil ha sido actualizado correctamente.");
            navigation.navigate('Chat');
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            Alert.alert("Error", "Hubo un problema al actualizar tu perfil.");
        }
    };

    const handleImagePick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permiso denegado", "Necesitamos permisos para acceder a tu galería.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleCameraPick = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permiso denegado", "Necesitamos permisos para acceder a tu cámara.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
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
                <TouchableOpacity onPress={handleImagePick}>
                    <Text style={styles.changeImageText}>Seleccionar imagen de la galería</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCameraPick}>
                    
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
        marginVertical: 5,
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
