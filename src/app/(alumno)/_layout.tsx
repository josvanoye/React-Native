import { Tabs } from 'expo-router';

import { icono } from '@/components/ui';
import { C } from '@/constants/colores';
import { useApp } from '@/context/app-context';

export default function AlumnoLayout() {
  const { noLeidos } = useApp();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.purpleL,
        tabBarInactiveTintColor: C.textMute,
        tabBarStyle: { backgroundColor: C.card, borderTopColor: C.border },
      }}>
      <Tabs.Screen name="inicio" options={{ title: 'Inicio', tabBarIcon: icono('🏠') }} />
      <Tabs.Screen name="solicitar" options={{ title: 'Solicitar', tabBarIcon: icono('➕') }} />
      <Tabs.Screen name="mis-solicitudes" options={{ title: 'Mis docs', tabBarIcon: icono('📄') }} />
      <Tabs.Screen name="avisos" options={{ title: 'Avisos', tabBarIcon: icono('🔔'), tabBarBadge: noLeidos > 0 ? noLeidos : undefined }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icono('👤') }} />
    </Tabs>
  );
}
