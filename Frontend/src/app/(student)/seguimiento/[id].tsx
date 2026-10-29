import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useApp } from '../../../context/AppContext'
import { colors as c, fonts } from '../../../constants/theme'
import { Icon, StatusBadge, SubHeader } from '../../../components/ui'
import { RequestStatus, STATUS_TIMELINE } from '../../../data/mock'

const INFO: Record<RequestStatus, { title: string; desc: string }> = {
  solicitud: { title: 'Solicitud enviada', desc: 'Tu solicitud fue recibida por Servicios Escolares.' },
  preparacion: { title: 'En preparación', desc: 'El documento está siendo preparado.' },
  listo: { title: 'Listo para recoger', desc: 'Preséntate en ventanilla 3 con tu ID.' },
  entregado: { title: 'Documento entregado ✓', desc: 'Documento entregado exitosamente.' },
}

export default function Seguimiento() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { requests } = useApp()
  const req = requests.find(r => r.id === id)
  if (!req) return null
  const currentIdx = STATUS_TIMELINE.indexOf(req.status)

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title="Seguimiento" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: c.text }}>{req.documentType}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute, marginTop: 2 }}>{req.id} · {req.createdAt}</Text>
            </View>
            <StatusBadge status={req.status} />
          </View>
          {req.status === 'entregado' && (
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#BBF7D0' }}>
              <Icon name="check-circle" size={14} color={c.green} />
              <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 12, color: c.green }}>Documento entregado en ventanilla. Recógelo presentando tu identificación.</Text>
            </View>
          )}
          {req.status === 'solicitud' && (
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: '#FEFCE8', borderWidth: 1, borderColor: '#FEF08A' }}>
              <Icon name="alert-circle" size={14} color={c.amber} />
              <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 12, color: c.amber }}>Solicitud recibida. Servicios Escolares comenzará a procesarla en breve.</Text>
            </View>
          )}
        </View>

        <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.textMid, marginBottom: 16 }}>Estado del proceso</Text>
        {STATUS_TIMELINE.map((step, idx) => {
          const done = idx <= currentIdx
          const current = idx === currentIdx
          const last = idx === STATUS_TIMELINE.length - 1
          const dotColor = done ? (current ? c.purpleL : c.purple) : c.border
          return (
            <View key={step} style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ alignItems: 'center', width: 20 }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? dotColor : c.card, borderWidth: 2, borderColor: dotColor }}>
                  {done && !current && <Icon name="check" size={10} color="#fff" />}
                  {current && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />}
                </View>
                {!last && <View style={{ flex: 1, width: 2, backgroundColor: idx < currentIdx ? c.purpleL : c.border }} />}
              </View>
              <View style={{ flex: 1, paddingBottom: 24, opacity: done ? 1 : 0.4 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: current ? c.purpleXL : c.text }}>{INFO[step].title}</Text>
                {done && <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute, marginTop: 2, lineHeight: 18 }}>{INFO[step].desc}</Text>}
                {current && req.observations ? (
                  <View style={{ marginTop: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: c.cream }}>
                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMid }}>Nota: {req.observations}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
