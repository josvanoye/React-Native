import { Pressable, ScrollView, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useApp } from '../../context/AppContext'
import { colors as c, fonts, shadow } from '../../constants/theme'
import { GradientButton, Header, Icon, StatusBadge } from '../../components/ui'
import { DOC_ACCENTS, DOC_TYPES } from '../../data/mock'

export default function Inicio() {
  const router = useRouter()
  const { currentUser: user, requests } = useApp()
  const displayName = user.name.split(' ').slice(0, 2).join(' ')
  const myReqs = requests.filter(r => r.studentId === user.studentId)
  const active = myReqs.filter(r => r.status !== 'entregado').length
  const inPrep = myReqs.filter(r => r.status === 'preparacion').length
  const done = myReqs.filter(r => r.status === 'entregado').length
  const visible = [...myReqs].reverse().slice(0, 5)

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Header style={{ paddingBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: '#DDD6FE', textTransform: 'uppercase', letterSpacing: 1 }}>Hola</Text>
            <Text style={{ fontFamily: fonts.extra, fontSize: 24, color: '#fff' }}>{displayName}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#EDE9FE', marginTop: 2 }}>
              {user.career} · Mat. {user.studentId}
            </Text>
          </View>
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="user" size={21} color="#fff" />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[
            { label: 'Activas', value: active, color: '#FDE68A' },
            { label: 'En preparación', value: inPrep, color: '#A5F3FC' },
            { label: 'Entregadas', value: done, color: '#BBF7D0' },
          ].map(s => (
            <View key={s.label} style={{ flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.14)' }}>
              <Text style={{ fontFamily: fonts.black, fontSize: 24, color: s.color }}>{s.value}</Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: '#fff', marginTop: 4 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </Header>

      <View style={{ paddingHorizontal: 20, marginTop: -20, zIndex: 10 }}>
        <GradientButton title="Solicitar documento" icon="plus" onPress={() => router.push('/solicitar')} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {visible.length > 0 && (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.text }}>Tus documentos</Text>
              <Pressable onPress={() => router.push('/mis-solicitudes')}>
                <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: c.purpleL }}>Ver todas</Text>
              </Pressable>
            </View>
            <View style={{ gap: 10 }}>
              {visible.map(r => {
                const doc = DOC_TYPES.find(d => d.name === r.documentType)
                const accent = doc ? DOC_ACCENTS[doc.id] : DOC_ACCENTS.historial
                return (
                  <Pressable key={r.id} onPress={() => router.push({ pathname: '/seguimiento/[id]', params: { id: r.id } })}
                    style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderLeftWidth: 5, borderLeftColor: accent.color }, shadow]}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: accent.bg, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={doc?.icon ?? 'file'} size={18} color={accent.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{r.documentType}</Text>
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute, marginTop: 2 }}>{r.id}</Text>
                    </View>
                    <StatusBadge status={r.status} />
                  </Pressable>
                )
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}
