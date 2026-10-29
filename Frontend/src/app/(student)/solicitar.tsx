import { useCallback, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useApp } from '../../context/AppContext'
import { colors as c, fonts, shadow } from '../../constants/theme'
import { Button, Header, Icon, InfoRow, SubHeader } from '../../components/ui'
import { DOC_ACCENTS, DOC_TYPES } from '../../data/mock'

type Step = 'catalog' | 'detail' | 'confirm' | 'success'

export default function Solicitar() {
  const { currentUser: user, addRequest } = useApp()
  const [step, setStep] = useState<Step>('catalog')
  const [docId, setDocId] = useState<string | null>(null)
  const [copies, setCopies] = useState(1)
  const doc = DOC_TYPES.find(d => d.id === docId) || null

  // Al salir de la pestaña, el flujo vuelve al catálogo
  useFocusEffect(useCallback(() => () => { setStep('catalog'); setDocId(null); setCopies(1) }, []))

  const SectionTitle = ({ text }: { text: string }) => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: c.cream }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.purpleXL, textTransform: 'uppercase', letterSpacing: 1 }}>{text}</Text>
    </View>
  )

  // ── Catálogo ──
  if (step === 'catalog') return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Header bg={c.lilac}>
        <Text style={{ fontFamily: fonts.extra, fontSize: 24, color: c.text }}>Solicitar documento</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: c.textMid, marginTop: 4 }}>Elige el documento que necesitas</Text>
      </Header>
      <ScrollView style={{ flex: 1, backgroundColor: c.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -20 }}
        contentContainerStyle={{ padding: 20, gap: 12 }} showsVerticalScrollIndicator={false}>
        {DOC_TYPES.map(d => (
          <Pressable key={d.id} onPress={() => { setDocId(d.id); setCopies(1); setStep('detail') }}
            style={[{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 16, backgroundColor: c.card, borderWidth: 1, borderColor: c.border }, shadow]}>
            <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: DOC_ACCENTS[d.id].bg, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={d.icon} size={20} color={DOC_ACCENTS[d.id].color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>{d.name}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute, marginTop: 2, lineHeight: 17 }}>{d.description}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.purpleXL }}>{d.cost === 0 ? 'Gratuito' : `$${d.cost} MXN`}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="clock" size={11} color={c.textMute} />
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute }}>{d.days} día{d.days !== 1 ? 's' : ''}</Text>
                </View>
              </View>
            </View>
            <Icon name="chevron-right" size={16} color={c.textMute} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )

  // ── Detalle ──
  if (step === 'detail' && doc) return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title={doc.name} onBack={() => setStep('catalog')} />
      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: c.purple, borderRadius: 24, padding: 24, marginBottom: 20 }}>
          <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Icon name={doc.icon} size={28} color="#fff" />
          </View>
          <Text style={{ fontFamily: fonts.extra, fontSize: 24, color: '#fff', marginBottom: 8 }}>{doc.name}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: '#DBEAFE', lineHeight: 21 }}>{doc.description}</Text>
        </View>
        <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: c.border, marginBottom: 16 }}>
          <InfoRow label="Costo" value={doc.cost === 0 ? 'Gratuito' : `$${doc.cost}.00 MXN`} />
          <InfoRow label="Tiempo estimado" value={`${doc.days} día${doc.days !== 1 ? 's' : ''} hábil${doc.days !== 1 ? 'es' : ''}`} />
          <InfoRow label="Entrega" value="Documento impreso en ventanilla" />
          <InfoRow label="Vigencia" value="90 días desde emisión" />
        </View>
        <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 16, padding: 16 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text, marginBottom: 12 }}>Número de copias</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Pressable onPress={() => setCopies(n => Math.max(1, n - 1))}
              style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="minus" size={18} color={c.purple} />
            </Pressable>
            <Text style={{ flex: 1, textAlign: 'center', fontFamily: fonts.extra, fontSize: 24, color: c.text }}>{copies}</Text>
            <Pressable onPress={() => setCopies(n => Math.min(5, n + 1))}
              style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: c.purple, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus" size={18} color="#fff" />
            </Pressable>
          </View>
          {copies > 1 && (
            <Text style={{ textAlign: 'center', fontFamily: fonts.regular, fontSize: 12, color: c.textMute, marginTop: 8 }}>
              Total: ${doc.cost * copies}.00 MXN
            </Text>
          )}
        </View>
      </ScrollView>
      <View style={{ padding: 20, paddingTop: 12 }}>
        <Button title={`Continuar — ${doc.cost === 0 ? 'Gratis' : `$${doc.cost * copies} MXN`}`} onPress={() => setStep('confirm')} />
      </View>
    </View>
  )

  // ── Confirmar ──
  if (step === 'confirm' && doc) return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <SubHeader title="Confirmar solicitud" onBack={() => setStep('detail')} />
      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: c.border, marginBottom: 16 }}>
          <SectionTitle text="Datos del estudiante" />
          <InfoRow label="Nombre" value={user.name} />
          <InfoRow label="Matrícula" value={user.studentId} />
          <InfoRow label="Carrera" value={user.career} />
          <InfoRow label="Semestre" value={user.semester} />
          <InfoRow label="Correo" value={user.email} />
        </View>
        <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: c.border, marginBottom: 20 }}>
          <SectionTitle text="Detalle del documento" />
          <InfoRow label="Documento" value={doc.name} />
          <InfoRow label="Copias" value={String(copies)} />
          <InfoRow label="Importe" value={doc.cost === 0 ? 'Gratuito' : `$${doc.cost * copies}.00 MXN`} strong />
          <InfoRow label="Tiempo estimado" value={`${doc.days} días hábiles`} />
        </View>
        <View style={{ flexDirection: 'row', gap: 12, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 16, padding: 16 }}>
          <Icon name="alert-circle" size={16} color={c.green} />
          <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 12, color: c.green, lineHeight: 18 }}>
            Al confirmar tu solicitud, Servicios Escolares la recibirá y comenzará a procesarla.
          </Text>
        </View>
      </ScrollView>
      <View style={{ padding: 20, paddingTop: 12 }}>
        <Button title="Confirmar solicitud" onPress={() => { addRequest(doc.name, copies); setStep('success') }} />
      </View>
    </View>
  )

  // ── Éxito ──
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icon name="check" size={36} color={c.green} />
      </View>
      <Text style={{ fontFamily: fonts.extra, fontSize: 24, color: c.text, marginBottom: 8, textAlign: 'center' }}>Solicitud enviada</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: c.textMute, textAlign: 'center', lineHeight: 21, marginBottom: 32 }}>
        Tu solicitud fue recibida. Servicios Escolares la procesará y te notificará cuando esté lista.
      </Text>
      <Button title="Nueva solicitud" onPress={() => { setStep('catalog'); setDocId(null); setCopies(1) }} style={{ alignSelf: 'stretch' }} />
    </View>
  )
}
