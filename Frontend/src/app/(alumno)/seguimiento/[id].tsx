import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useApp } from '@/context/app-context'
import { C } from '@/constants/colores'
import { Encabezado, Insignia } from '@/components/ui'
import { RequestStatus, STATUS_TIMELINE } from '@/data/mock'

const X = {
  bg: '#F8F7FC',
  cream: '#FEF3C7',
  green: '#047857',
  greenBg: '#DCFCE7',
  greenBorder: '#BBF7D0',
  amber: '#B45309',
  amberBg: '#FEFCE8',
  amberBorder: '#FEF08A',
  textMid: '#4B5563',
  purpleXL: '#5B21B6',
}

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
      <View style={{ flex: 1, backgroundColor: X.bg }}>
        <Encabezado titulo="Seguimiento" atras={() => router.back()} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 16, color: C.text }}>{req.documentType}</Text>
                <Text style={{ fontSize: 12, color: C.textMute, marginTop: 2 }}>{req.id} · {req.createdAt}</Text>
              </View>
              <Insignia estado={req.status} />
            </View>
            {req.status === 'entregado' && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: X.greenBg, borderWidth: 1, borderColor: X.greenBorder }}>
                  <Text style={{ color: X.green, fontSize: 12 }}>✓</Text>
                  <Text style={{ flex: 1, fontSize: 12, color: X.green }}>Documento entregado en ventanilla. Recógelo presentando tu identificación.</Text>
                </View>
            )}
            {req.status === 'solicitud' && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: X.amberBg, borderWidth: 1, borderColor: X.amberBorder }}>
                  <Text style={{ color: X.amber, fontSize: 12 }}>!</Text>
                  <Text style={{ flex: 1, fontSize: 12, color: X.amber }}>Solicitud recibida. Servicios Escolares comenzará a procesarla en breve.</Text>
                </View>
            )}
          </View>

          <Text style={{ fontWeight: '700', fontSize: 14, color: X.textMid, marginBottom: 16 }}>Estado del proceso</Text>
          {STATUS_TIMELINE.map((step, idx) => {
            const done = idx <= currentIdx
            const current = idx === currentIdx
            const last = idx === STATUS_TIMELINE.length - 1
            const dotColor = done ? (current ? C.purpleL : C.purple) : C.border
            return (
                <View key={step} style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ alignItems: 'center', width: 20 }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? dotColor : C.card, borderWidth: 2, borderColor: dotColor }}>
                      {done && !current && <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>}
                      {current && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />}
                    </View>
                    {!last && <View style={{ flex: 1, width: 2, backgroundColor: idx < currentIdx ? C.purpleL : C.border }} />}
                  </View>
                  <View style={{ flex: 1, paddingBottom: 24, opacity: done ? 1 : 0.4 }}>
                    <Text style={{ fontWeight: '700', fontSize: 14, color: current ? X.purpleXL : C.text }}>{INFO[step].title}</Text>
                    {done && <Text style={{ fontSize: 12, color: C.textMute, marginTop: 2, lineHeight: 18 }}>{INFO[step].desc}</Text>}
                    {current && req.observations ? (
                        <View style={{ marginTop: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: X.cream }}>
                          <Text style={{ fontSize: 12, color: X.textMid }}>Nota: {req.observations}</Text>
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