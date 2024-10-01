import React from 'react';
import { registerRootComponent } from 'expo'; // Expo se encargará del registro de la aplicación
import AppNavigator from '../src/navigation/AppNavigator'; // Ruta correcta al AppNavigator
import { StatusBar } from 'expo-status-bar';

// Definir tu componente App principal
const App = () => {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
};

// Registrar el componente principal de la aplicación
registerRootComponent(App);
