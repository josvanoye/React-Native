// Este archivo define cómo se acomodan todas las pantallas de la app.
// Expo Router lo carga primero, antes de mostrar cualquier pantalla.

// Stack = las pantallas se apilan una encima de otra (permite regresar)
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/auth-context';
import { AppProvider } from '@/context/app-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </AppProvider>
    </AuthProvider>
  );
}
