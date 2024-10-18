import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importa tus pantallas
import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import Register from '../screens/register/Register';
import Chat from '../screens/chat/Chat';
import Settings from '../screens/settings/Settings';
import ChatHistory from '../screens/chat/ChatHistory'; 
import ChatDetails from '../screens/chat/ChatDetails'; 

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación

  useEffect(() => {
    // Función para verificar si el usuario está autenticado
    const checkAuthentication = async () => {
      const userToken = await AsyncStorage.getItem('userToken'); // Verifica el token guardado
      setIsAuthenticated(!!userToken); // Actualiza el estado según la existencia del token
    };

    checkAuthentication();
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken'); // Elimina el token al cerrar sesión
    setIsAuthenticated(false); // Cambia el estado a no autenticado
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Chat" : "Home"} // Cambia la pantalla inicial según el estado de autenticación
        screenOptions={{ headerShown: false }} // Oculta el encabezado
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen 
          name="Login" 
          component={props => <Login {...props} setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen 
          name="Chat" 
          component={props => <Chat {...props} onLogout={handleLogout} />} 
        />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="ChatHistory" component={ChatHistory} />
        <Stack.Screen name="ChatDetails" component={ChatDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
