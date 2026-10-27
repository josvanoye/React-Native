import { Tabs } from 'expo-router';

import { icono } from '@/components/ui';
import { C } from '@/constants/colores';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.purpleL,
        tabBarInactiveTintColor: C.textMute,
        tabBarStyle: { backgroundColor: C.card, borderTopColor: C.border },
      }}>
      <Tabs.Screen name="panel" options={{ title: 'Panel', tabBarIcon: icono('🗂️') }} />
      <Tabs.Screen name="solicitudes" options={{ title: 'Solicitudes', tabBarIcon: icono('📋') }} />
      <Tabs.Screen name="estadisticas" options={{ title: 'Estadísticas', tabBarIcon: icono('📊') }} />
      <Tabs.Screen name="perfil-admin" options={{ title: 'Perfil', tabBarIcon: icono('👤') }} />
      {/* El detalle se abre desde las solicitudes, no sale en la barra */}
      <Tabs.Screen name="detalle" options={{ href: null }} />
    </Tabs>
  );
}
