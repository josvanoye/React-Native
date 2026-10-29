import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useApp } from '../../context/AppContext'
import { colors as c, fonts, shadow } from '../../constants/theme'
import { Header, Icon, Sheet, StatusBadge } from '../../components/ui'
import { DOC_ACCENTS, DOC_TYPES } from '../../data/mock'

export default function MisSolicitudes() {
  const router = useRouter()
  const { currentUser, requests } = useApp()
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')
  const mine = requests.filter(r => r.studentId === currentUser.studentId)
  const filtered = mine.filter(r => filter === 'all' ? true : filter === 'active' ? r.status !== 'entregado' : r.status === 'entregado')

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Header bg={c.lilac}>
        <Text style={{ fontFamily: fonts.extra, fontSize: 24, color: c.text }}>Mis solicitudes</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          {(['all', 'active', 'done'] as const).map(f => (
            <Pressable key={f} onPress={() => setFilter(f)}
              style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: filter === f ? c.purple : c.cream }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: filter === f ? '#fff' : c.textMute }}>
                {f === 'all' ? 'Todas' : f === 'active' ? 'En proceso' : 'Entregadas'}
              </Text>
            </Pressable>
          ))}
        </View>
      </Header>
      <Sheet contentStyle={{ gap: 12 }}>
        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 64, opacity: 0.6 }}>
            <Icon name="file" size={40} color={c.textMute} />
            <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: c.textMute, marginTop: 12 }}>Sin solicitudes</Text>
          </View>
        )}
        {filtered.map(r => {
          const doc = DOC_TYPES.find(d => d.name === r.documentType)
          const accent = doc ? DOC_ACCENTS[doc.id] : DOC_ACCENTS.historial
          return (
            <Pressable key={r.id} onPress={() => router.push({ pathname: '/seguimiento/[id]', params: { id: r.id } })}
              style={[{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderLeftWidth: 5, borderLeftColor: accent.color }, shadow]}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: accent.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={doc?.icon ?? 'file'} size={18} color={accent.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{r.documentType}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute, marginTop: 2 }}>{r.id} · {r.createdAt}</Text>
                <View style={{ marginTop: 6 }}><StatusBadge status={r.status} /></View>
              </View>
              <Icon name="chevron-right" size={16} color={c.textMute} />
            </Pressable>
          )
        })}
      </Sheet>
    </View>
  )
}
