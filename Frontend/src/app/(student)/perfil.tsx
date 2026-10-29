import { useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useApp } from '../../context/AppContext'
import { colors as c, fonts } from '../../constants/theme'
import { Button, Header, Icon, Sheet } from '../../components/ui'

export default function Perfil() {
  const router = useRouter()
  const { currentUser: user, logout, changePassword } = useApp()
  const [editMode, setEditMode] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordChanged, setPasswordChanged] = useState(false)

  const openPasswordPanel = () => {
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    setPasswordError(''); setPasswordChanged(false); setPasswordOpen(true)
  }

  const savePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return setPasswordError('Completa todos los campos')
    if (newPassword.length < 8) return setPasswordError('La nueva contraseña debe tener al menos 8 caracteres')
    if (newPassword !== confirmPassword) return setPasswordError('Las contraseñas nuevas no coinciden')
    if (!changePassword(currentPassword, newPassword)) return setPasswordError('La contraseña actual no es correcta')
    setPasswordError('')
    setPasswordChanged(true)
  }

  const handleLogout = () => { logout(); router.replace('/') }

  const infoRows = [
    { icon: 'mail', label: user.email, color: '#3B82F6', bg: '#EFF6FF' },
    { icon: 'phone', label: user.phone, color: '#059669', bg: '#ECFDF5' },
    { icon: 'briefcase', label: 'Universidad Politécnica de México', color: '#F97316', bg: '#FFF7ED' },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Header>
        <Text style={{ fontFamily: fonts.extra, fontSize: 24, color: '#fff' }}>Mi perfil</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 20 }}>
          <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="user" size={27} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.extra, fontSize: 18, color: '#fff' }}>{user.name}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#EDE9FE' }}>Matrícula: {user.studentId}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#EDE9FE' }}>{user.career} · {user.semester}</Text>
          </View>
          <Pressable onPress={() => setEditMode(v => !v)}
            style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="edit-2" size={15} color="#fff" />
          </Pressable>
        </View>
      </Header>

      <Sheet contentStyle={{ gap: 16 }}>
        {editMode && (
          <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: c.purpleL }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: c.cream }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.purpleXL, textTransform: 'uppercase', letterSpacing: 1 }}>Editar datos</Text>
              <Pressable onPress={() => setEditMode(false)}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.purpleL }}>Guardar</Text>
              </Pressable>
            </View>
            {[{ label: 'Nombre', val: user.name }, { label: 'Correo', val: user.email }, { label: 'Teléfono', val: user.phone }].map(f => (
              <View key={f.label} style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: c.card, borderBottomWidth: 1, borderBottomColor: c.border }}>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: c.textMute, marginBottom: 2 }}>{f.label}</Text>
                <TextInput defaultValue={f.val} style={{ fontFamily: fonts.regular, fontSize: 14, color: c.text, padding: 0 }} />
              </View>
            ))}
          </View>
        )}

        <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: c.border }}>
          {infoRows.map(row => (
            <View key={row.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: c.card, borderBottomWidth: 1, borderBottomColor: c.border }}>
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: row.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={row.icon} size={15} color={row.color} />
              </View>
              <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 14, color: c.text }}>{row.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: c.border }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: c.cream }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.textMute, textTransform: 'uppercase', letterSpacing: 1 }}>Seguridad</Text>
          </View>
          <Pressable onPress={openPasswordPanel}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: c.card }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Icon name="settings" size={16} color={c.purpleL} />
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: c.text }}>Cambiar contraseña</Text>
            </View>
            <Icon name="chevron-right" size={14} color={c.textMute} />
          </Pressable>
        </View>

        <Button title="Cerrar sesión" icon="log-out" variant="danger" onPress={handleLogout} />
      </Sheet>

      <Modal visible={passwordOpen} transparent animationType="slide" onRequestClose={() => setPasswordOpen(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(43,27,63,0.48)', justifyContent: 'flex-end', padding: 20 }} onPress={() => setPasswordOpen(false)}>
            <Pressable style={{ backgroundColor: c.card, borderRadius: 24, padding: 20 }} onPress={() => {}}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: c.border, alignSelf: 'center', marginBottom: 20 }} />
              <View style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon name="settings" size={20} color={c.purpleL} />
              </View>
              <Text style={{ fontFamily: fonts.extra, fontSize: 22, color: c.text }}>Cambiar contraseña</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: c.textMute, marginTop: 4, marginBottom: 18 }}>
                Protege tu cuenta con una contraseña nueva de al menos 8 caracteres.
              </Text>
              {passwordChanged ? (
                <View style={{ flexDirection: 'row', gap: 12, backgroundColor: '#DCFCE7', borderRadius: 16, padding: 16, marginBottom: 20 }}>
                  <Icon name="check-circle" size={19} color={c.green} />
                  <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: c.green }}>Tu contraseña se actualizó correctamente.</Text>
                </View>
              ) : (
                <View style={{ gap: 12, marginBottom: 16 }}>
                  {[
                    { label: 'CONTRASEÑA ACTUAL', value: currentPassword, set: setCurrentPassword, ph: 'Ingresa tu contraseña actual' },
                    { label: 'NUEVA CONTRASEÑA', value: newPassword, set: setNewPassword, ph: 'Mínimo 8 caracteres' },
                    { label: 'CONFIRMAR CONTRASEÑA', value: confirmPassword, set: setConfirmPassword, ph: 'Repite la nueva contraseña' },
                  ].map(f => (
                    <View key={f.label}>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: c.textMute, marginBottom: 6 }}>{f.label}</Text>
                      <TextInput value={f.value} onChangeText={f.set} placeholder={f.ph} placeholderTextColor={c.textMute}
                        secureTextEntry autoCapitalize="none"
                        style={{ backgroundColor: c.bg, borderWidth: 1, borderColor: c.border, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, fontFamily: fonts.regular, fontSize: 14, color: c.text }} />
                    </View>
                  ))}
                  {passwordError ? <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: c.red }}>{passwordError}</Text> : null}
                </View>
              )}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Button title={passwordChanged ? 'Cerrar' : 'Cancelar'} variant="soft" onPress={() => setPasswordOpen(false)} style={{ flex: 1 }} />
                {!passwordChanged && <Button title="Actualizar" onPress={savePassword} style={{ flex: 1 }} />}
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}
