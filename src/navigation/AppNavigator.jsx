import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa tus pantallas
import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import Register from '../screens/register/Register';
import Chat from '../screens/chat/Chat';

const Stack = createStackNavigator();

const ContextNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" // Cambia a Home como pantalla inicial
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ContextNavigator;
