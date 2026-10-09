// Este archivo define cómo se acomodan todas las pantallas de la app.
// Expo Router lo carga primero, antes de mostrar cualquier pantalla.

// Stack = las pantallas se apilan una encima de otra (permite regresar)
import { Stack } from 'expo-router';
// Controla la barra de arriba del celular (hora, batería)
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    // Fragmento: agrupa varios elementos sin crear un contenedor extra
    <>
      {/* Íconos oscuros en la barra de estado (el fondo del registro es claro) */}
      <StatusBar style="dark" />
      {/* headerShown: false = quitamos la barra de título que Expo pone por defecto */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
