import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useApp } from '@/context/app-context'
import { C } from '@/constants/colores'
import { Encabezado, Insignia } from '@/components/ui'
import { STATUS_LABELS, STATUS_TIMELINE } from '@/data/mock'

const X = {
  bg: '#F8F7FC',
  admin: '#7C3AED',
  cream: '#FEF3C7',
  green: '#047857',
  greenBg: '#DCFCE7',
}

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
  const card = { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 16 }
  const row = { flexDirection: 'row' as const, justifyContent: 'space-between' as const, paddingVertical: 8, borderTopWidth: 1, borderTopColor: C.border }

  const advance = () => {
    advanceRequest(req.id, obs)
    router.replace('/solicitudes')
  }

  return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: X.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Encabezado titulo="Detalle" atras={() => router.back()} derecha={<Insignia estado={req.status} />} />
        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: X.cream, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>🎓</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 14, color: C.text }}>{req.studentName}</Text>
                <Text style={{ fontSize: 12, color: C.textMute }}>{req.career}</Text>
              </View>
            </View>
            {[{ l: 'Matrícula', v: req.studentId }, { l: 'Semestre', v: req.semester }, { l: 'Correo', v: req.email }].map(r => (
                <View key={r.l} style={row}>
                  <Text style={{ fontSize: 12, color: C.textMute }}>{r.l}</Text>
                  <Text style={{ fontWeight: '600', fontSize: 12, color: C.text }}>{r.v}</Text>
                </View>
            ))}
          </View>

          <View style={card}>
            <Text style={{ fontWeight: '700', fontSize: 14, color: C.text, marginBottom: 12 }}>{req.documentType}</Text>
            {[{ l: 'ID', v: req.id }, { l: 'Copias', v: String(req.copies) }, { l: 'Fecha de solicitud', v: req.createdAt }].map(r => (
                <View key={r.l} style={row}>
                  <Text style={{ fontSize: 12, color: C.textMute }}>{r.l}</Text>
                  <Text style={{ fontWeight: '700', fontSize: 12, color: C.text }}>{r.v}</Text>
                </View>
            ))}
          </View>

          <Pressable
              onPress={() => setHistoryOpen(v => !v)}
              style={[card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, marginBottom: historyOpen ? 8 : 16 }]}
          >
            <Text style={{ fontWeight: '700', fontSize: 14, color: C.text }}>Historial de estados</Text>
            <Text style={{ fontSize: 16, color: C.textMute }}>{historyOpen ? '⌄' : '›'}</Text>
          </Pressable>
          {historyOpen && (
              <View style={card}>
                {STATUS_TIMELINE.slice(0, currentIdx + 1).map((step, idx, arr) => (
                    <View key={step} style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{ alignItems: 'center', width: 20 }}>
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: idx === currentIdx ? C.purpleL : C.purple, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>
                        </View>
                        {idx < arr.length - 1 && <View style={{ flex: 1, width: 2, backgroundColor: C.purpleL }} />}
                      </View>
                      <View style={{ flex: 1, paddingBottom: idx < arr.length - 1 ? 16 : 0 }}>
                        <Text style={{ fontWeight: '700', fontSize: 12, color: C.text }}>{STATUS_LABELS[step]}</Text>
                        <Text style={{ fontSize: 12, color: C.textMute }}>{req.createdAt}</Text>
                      </View>
                    </View>
                ))}
              </View>
          )}

          <View style={card}>
            <Text style={{ fontWeight: '700', fontSize: 12, color: C.textMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Observaciones</Text>
            <TextInput
                value={obs}
                onChangeText={setObs}
                multiline
                numberOfLines={3}
                placeholder="Agregar nota interna..."
                placeholderTextColor={C.textMute}
                textAlignVertical="top"
                style={{ minHeight: 70, fontSize: 14, color: C.text, lineHeight: 21, padding: 0 }}
            />
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: X.bg, borderTopWidth: 1, borderTopColor: C.border }}>
          <View style={{ flexDirection: 'row', gap: 4, marginBottom: 8 }}>
            {STATUS_TIMELINE.map((s, idx) => (
                <View key={s} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: idx <= currentIdx ? C.purpleL : C.border }} />
            ))}
          </View>
          <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 12, color: C.textMute, marginBottom: 10 }}>
            Paso {currentIdx + 1} de {STATUS_TIMELINE.length} · {STATUS_LABELS[req.status]}
          </Text>
          {nextStatus ? (
              <Pressable
                  onPress={advance}
                  style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, backgroundColor: X.admin, elevation: 4 }}
              >
                <Text style={{ fontWeight: '700', fontSize: 14, color: '#fff' }}>Marcar como: {STATUS_LABELS[nextStatus]}</Text>
              </Pressable>
          ) : (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 16, backgroundColor: X.greenBg }}>
                <Text style={{ fontWeight: '600', fontSize: 14, color: X.green }}>✓ Proceso completado</Text>
              </View>
          )}
        </View>
      </KeyboardAvoidingView>
  )
}