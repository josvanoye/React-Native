// Este archivo define cómo se acomodan todas las pantallas de la app.
// Expo Router lo carga primero, antes de mostrar cualquier pantalla.

// Stack = las pantallas se apilan una encima de otra (permite regresar)
import { Stack } from 'expo-router';
// Importa el componente StatusBar, que controla la barra de estado del celular (hora, batería, señal)
import { StatusBar } from 'expo-status-bar';
// Importa el proveedor de autenticación, que guarda quién inició sesión y su rol
import { AuthProvider } from '@/context/auth-context';
// Importa el proveedor de datos de la app, que guarda solicitudes, avisos y demás información compartida
import { AppProvider } from '@/context/app-context';

// Layout raíz: envuelve toda la app, por eso es lo primero que se carga
export default function RootLayout() {
    return (
        // AuthProvider va hasta afuera para que todas las pantallas puedan saber si hay sesión iniciada
        <AuthProvider>
            {/* AppProvider va dentro para compartir los datos de la app con todas las pantallas */}
            <AppProvider>
                {/* Pone los íconos de la barra de estado en color oscuro para que se vean sobre fondo claro */}
                <StatusBar style="dark" />
                {/* Stack que apila las pantallas; headerShown: false oculta el encabezado superior por defecto */}
                <Stack screenOptions={{ headerShown: false }} />
            </AppProvider>
        </AuthProvider>
    );
}