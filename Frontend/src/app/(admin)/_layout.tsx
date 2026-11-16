// Importa el componente Tabs de expo-router, que crea la barra de pestañas inferior
import { Tabs } from 'expo-router';
// Importa la función icono, que genera el ícono (emoji) de cada pestaña
import { icono } from '@/components/ui';
// Importa la paleta de colores de la app (C) para mantener el mismo estilo en todas las pantallas
import { C } from '@/constants/colores';

// Layout del administrador: define la barra de pestañas que ve el usuario con rol admin
export default function AdminLayout() {
    return (
        // Contenedor de la barra de navegación con pestañas
        <Tabs
            // Opciones generales que se aplican a todas las pestañas
            screenOptions={{
                // Oculta el encabezado superior que pone la navegación por defecto
                headerShown: false,
                // Color del ícono y texto de la pestaña que está seleccionada
                tabBarActiveTintColor: C.purpleL,
                // Color del ícono y texto de las pestañas que no están seleccionadas
                tabBarInactiveTintColor: C.textMute,
                // Estilo de la barra: color de fondo y color de la línea superior
                tabBarStyle: { backgroundColor: C.card, borderTopColor: C.border },
            }}>
            {/* Pestaña 1: pantalla principal del administrador (archivo panel) */}
            <Tabs.Screen name="panel" options={{ title: 'Panel', tabBarIcon: icono('🗂️') }} />
            {/* Pestaña 2: lista de solicitudes (archivo solicitudes) */}
            <Tabs.Screen name="solicitudes" options={{ title: 'Solicitudes', tabBarIcon: icono('📋') }} />
            {/* Pestaña 3: gráficas y datos estadísticos (archivo estadisticas) */}
            <Tabs.Screen name="estadisticas" options={{ title: 'Estadísticas', tabBarIcon: icono('📊') }} />
            {/* Pestaña 4: perfil del administrador (archivo perfil-admin) */}
            <Tabs.Screen name="perfil-admin" options={{ title: 'Perfil', tabBarIcon: icono('👤') }} />
            {/* El detalle se abre desde las solicitudes, no sale en la barra */}
            {/* href: null hace que la pantalla exista en la navegación pero no aparezca como pestaña */}
            <Tabs.Screen name="detalle" options={{ href: null }} />
        </Tabs>
    );
}