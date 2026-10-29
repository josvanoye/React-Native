import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useApp } from '../../../context/AppContext'
import { colors as c, fonts } from '../../../constants/theme'
import { Icon, StatusBadge, SubHeader } from '../../../components/ui'
import { STATUS_LABELS, STATUS_TIMELINE } from '../../../data/mock'

export default function DetalleSolicitud() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { requests, advanceRequest } = useApp()
  const req = requests.find(r => r.id === id)
  const [obs, setObs] = useState(req?.observations || '')
  const [historyOpen, setHistoryOpen] = useState(false)
  if (!req) return null

  const currentIdx = STATUS_TIMELINE.indexOf(req.status)
  const nextStatus = STATUS_TIMELINE[currentIdx + 1]
  const nextIcon = req.status === 'solicitud' ? 'chevron-right' : req.status === 'preparacion' ? 'check-circle' : 'check'
  const card = { backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 16, padding: 16, marginBottom: 16 }
  const row = { flexDirection: 'row' as const, justifyContent: 'space-between' as const, paddingVertical: 8, borderTopWidth: 1, borderTopColor: c.border }

  const advance = () => {
    advanceRequest(req.id, obs)
    router.replace('/solicitudes')
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SubHeader title="Detalle" onBack={() => router.back()} right={<StatusBadge status={req.status} />} />
      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18 }}>🎓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{req.studentName}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute }}>{req.career}</Text>
            </View>
          </View>
          {[{ l: 'Matrícula', v: req.studentId }, { l: 'Semestre', v: req.semester }, { l: 'Correo', v: req.email }].map(r => (
            <View key={r.l} style={row}>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute }}>{r.l}</Text>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: c.text }}>{r.v}</Text>
            </View>
          ))}
        </View>

        <View style={card}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text, marginBottom: 12 }}>{req.documentType}</Text>
          {[{ l: 'ID', v: req.id }, { l: 'Copias', v: String(req.copies) }, { l: 'Fecha de solicitud', v: req.createdAt }].map(r => (
            <View key={r.l} style={row}>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute }}>{r.l}</Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.text }}>{r.v}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={() => setHistoryOpen(v => !v)}
          style={[card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, marginBottom: historyOpen ? 8 : 16 }]}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>Historial de estados</Text>
          <Icon name={historyOpen ? 'chevron-down' : 'chevron-right'} size={16} color={c.textMute} />
        </Pressable>
        {historyOpen && (
          <View style={card}>
            {STATUS_TIMELINE.slice(0, currentIdx + 1).map((step, idx, arr) => (
              <View key={step} style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ alignItems: 'center', width: 20 }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: idx === currentIdx ? c.purpleL : c.purple, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="check" size={10} color="#fff" />
                  </View>
                  {idx < arr.length - 1 && <View style={{ flex: 1, width: 2, backgroundColor: c.purpleL }} />}
                </View>
                <View style={{ flex: 1, paddingBottom: idx < arr.length - 1 ? 16 : 0 }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.text }}>{STATUS_LABELS[step]}</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute }}>{req.createdAt}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={card}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.textMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Observaciones</Text>
          <TextInput value={obs} onChangeText={setObs} multiline numberOfLines={3} placeholder="Agregar nota interna..."
            placeholderTextColor={c.textMute} textAlignVertical="top"
            style={{ minHeight: 70, fontFamily: fonts.regular, fontSize: 14, color: c.text, lineHeight: 21, padding: 0 }} />
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: c.bg, borderTopWidth: 1, borderTopColor: c.border }}>
        <View style={{ flexDirection: 'row', gap: 4, marginBottom: 8 }}>
          {STATUS_TIMELINE.map((s, idx) => (
            <View key={s} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: idx <= currentIdx ? c.purpleL : c.border }} />
          ))}
        </View>
        <Text style={{ textAlign: 'center', fontFamily: fonts.semibold, fontSize: 12, color: c.textMute, marginBottom: 10 }}>
          Paso {currentIdx + 1} de {STATUS_TIMELINE.length} · {STATUS_LABELS[req.status]}
        </Text>
        {nextStatus ? (
          <Pressable onPress={advance}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, backgroundColor: c.admin, elevation: 4 }}>
            <Icon name={nextIcon} size={16} color="#fff" />
            <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: '#fff' }}>Marcar como: {STATUS_LABELS[nextStatus]}</Text>
          </Pressable>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 16, backgroundColor: '#DCFCE7' }}>
            <Icon name="check-circle" size={15} color={c.green} />
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: c.green }}>Proceso completado</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}
