import { Tabs } from 'expo-router'
import { colors as c, fonts } from '../../constants/theme'
import { Icon } from '../../components/ui'
import { useApp } from '../../context/AppContext'

export default function StudentLayout() {
  const { unread } = useApp()
  const tab = (title: string, icon: string, badge?: number) => ({
    title,
    tabBarBadge: badge && badge > 0 ? badge : undefined,
    tabBarBadgeStyle: { backgroundColor: c.red, fontFamily: fonts.bold, fontSize: 10 },
    tabBarIcon: ({ color }: { color: string }) => <Icon name={icon} size={22} color={color} />,
  })

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: c.purpleL,
      tabBarInactiveTintColor: c.textMute,
      tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 },
      tabBarStyle: { backgroundColor: c.card, borderTopColor: c.border },
    }}>
      <Tabs.Screen name="inicio" options={tab('Inicio', 'home')} />
      <Tabs.Screen name="solicitar" options={tab('Solicitar', 'plus')} />
      <Tabs.Screen name="mis-solicitudes" options={tab('Mis docs', 'list')} />
      <Tabs.Screen name="avisos" options={tab('Avisos', 'bell', unread)} />
      <Tabs.Screen name="perfil" options={tab('Perfil', 'user')} />
      <Tabs.Screen name="seguimiento/[id]" options={{ href: null }} />
    </Tabs>
  )
}
