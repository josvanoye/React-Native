import { Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useApp } from '../../context/AppContext'
import { colors as c, fonts } from '../../constants/theme'
import { Header, Icon, Sheet } from '../../components/ui'

export default function Avisos() {
  const router = useRouter()
  const { notifications, unread, markAllRead } = useApp()

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Header bg={c.lilac}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.extra, fontSize: 24, color: c.text }}>Notificaciones</Text>
          {unread > 0 && (
            <Pressable onPress={markAllRead}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.purple }}>Marcar leídas</Text>
            </Pressable>
          )}
        </View>
      </Header>
      <Sheet contentStyle={{ padding: 0 }}>
        {notifications.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 80, opacity: 0.6 }}>
            <Icon name="bell" size={40} color={c.textMute} />
            <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: c.textMute, marginTop: 12 }}>Sin notificaciones</Text>
          </View>
        )}
        {notifications.map(n => (
          <Pressable key={n.id}
            onPress={() => n.requestId && router.push({ pathname: '/seguimiento/[id]', params: { id: n.requestId } })}
            style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.border, backgroundColor: n.read ? 'transparent' : 'rgba(109,40,217,0.05)' }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
              <Icon name="bell" size={16} color={c.purpleL} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <Text style={{ flex: 1, fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{n.title}</Text>
                {!n.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.purpleL, marginTop: 6 }} />}
              </View>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute, marginTop: 4, lineHeight: 18 }}>{n.body}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute, marginTop: 6 }}>{n.time}</Text>
            </View>
          </Pressable>
        ))}
      </Sheet>
    </View>
  )
}
