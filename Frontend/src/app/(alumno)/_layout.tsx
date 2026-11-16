// Importa el componente Tabs de expo-router, que crea la barra de pestañas inferior
import { Tabs } from 'expo-router';

// Importa la función icono, que genera el ícono (emoji) de cada pestaña
import { icono } from '@/components/ui';
// Importa la paleta de colores de la app (C) para mantener el mismo estilo en todas las pantallas
import { C } from '@/constants/colores';
// Importa el hook useApp para acceder al estado global de la app (context)
import { useApp } from '@/context/app-context';

// Layout del alumno: define la barra de pestañas que ve el usuario con rol alumno
export default function AlumnoLayout() {
    // Obtiene del contexto global la cantidad de avisos que el alumno aún no ha leído
    const { noLeidos } = useApp();
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
            {/* Pestaña 1: pantalla de inicio del alumno (archivo inicio) */}
            <Tabs.Screen name="inicio" options={{ title: 'Inicio', tabBarIcon: icono('🏠') }} />
            {/* Pestaña 2: formulario para pedir un nuevo documento (archivo solicitar) */}
            <Tabs.Screen name="solicitar" options={{ title: 'Solicitar', tabBarIcon: icono('➕') }} />
            {/* Pestaña 3: lista de los documentos que el alumno ya solicitó (archivo mis-solicitudes) */}
            <Tabs.Screen name="mis-solicitudes" options={{ title: 'Mis docs', tabBarIcon: icono('📄') }} />
            {/* Pestaña 4: avisos o notificaciones del alumno (archivo avisos) */}
            {/* tabBarBadge muestra un globito con el número de avisos no leídos; si es 0, no se muestra nada (undefined) */}
            <Tabs.Screen name="avisos" options={{ title: 'Avisos', tabBarIcon: icono('🔔'), tabBarBadge: noLeidos > 0 ? noLeidos : undefined }} />
            {/* Pestaña 5: perfil del alumno (archivo perfil) */}
            <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icono('👤') }} />
        </Tabs>
    );
}