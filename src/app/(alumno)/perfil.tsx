import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Cabecera, comun } from '@/components/ui';
import { C } from '@/constants/colores';
import { ALUMNO } from '@/data/datos';

export default function Perfil() {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [push, setPush] = useState(true);
  const [correo, setCorreo] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Cabecera>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>Mi perfil</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <View style={styles.avatar}><Text style={{ fontSize: 30 }}>🎓</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '600', color: '#fff' }}>{ALUMNO.nombre}</Text>
            <Text style={{ fontSize: 12, color: '#DDD6FE' }}>Matrícula: {ALUMNO.matricula}</Text>
            <Text style={{ fontSize: 12, color: '#DDD6FE' }}>Ing. en Sistemas · {ALUMNO.semestre}</Text>
          </View>
          <TouchableOpacity style={styles.editar} onPress={() => setEditando(v => !v)}>
            <Text style={{ fontSize: 15 }}>✏️</Text>
          </TouchableOpacity>
        </View>
      </Cabecera>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        {editando && (
          <View style={[comun.tarjeta, { borderColor: C.purpleL }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: C.purpleXL, textTransform: 'uppercase' }}>Editar datos</Text>
              <TouchableOpacity onPress={() => setEditando(false)}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.purpleL }}>Guardar</Text>
              </TouchableOpacity>
            </View>
            {[['Nombre', ALUMNO.nombre], ['Correo', ALUMNO.correo], ['Teléfono', ALUMNO.telefono]].map(([etiqueta, valor]) => (
              <View key={etiqueta} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border }}>
                <Text style={{ fontSize: 11, color: C.textMute }}>{etiqueta}</Text>
                <TextInput defaultValue={valor} style={{ fontSize: 14, color: C.text, paddingVertical: 4 }} />
              </View>
            ))}
          </View>
        )}

        <View style={[comun.tarjeta, { paddingVertical: 4 }]}>
          {['✉️  ' + ALUMNO.correo, '📞  ' + ALUMNO.telefono, '🏫  Universidad Politécnica de México'].map(t => (
            <Text key={t} style={{ fontSize: 14, color: C.text, paddingVertical: 12 }}>{t}</Text>
          ))}
        </View>

        <View style={[comun.tarjeta, { paddingVertical: 4 }]}>
          <Text style={[comun.etiqueta, { marginTop: 12 }]}>Preferencias</Text>
          <View style={styles.pref}>
            <Text style={{ fontSize: 14, color: C.text }}>🔔  Notificaciones push</Text>
            <Switch value={push} onValueChange={setPush} trackColor={{ false: C.border, true: C.purpleL }} thumbColor="#fff" />
          </View>
          <View style={styles.pref}>
            <Text style={{ fontSize: 14, color: C.text }}>✉️  Notificaciones por correo</Text>
            <Switch value={correo} onValueChange={setCorreo} trackColor={{ false: C.border, true: C.purpleL }} thumbColor="#fff" />
          </View>
          <View style={[styles.pref, { borderBottomWidth: 0, paddingVertical: 14 }]}>
            <Text style={{ fontSize: 14, color: C.text }}>⚙️  Cambiar contraseña</Text>
            <Text style={{ color: C.textMute, fontSize: 18 }}>›</Text>
          </View>
        </View>

        <TouchableOpacity style={[comun.boton, { backgroundColor: '#FEF2F2' }]} onPress={() => router.replace('/')}>
          <Text style={{ color: '#EF4444', fontWeight: '500', fontSize: 14 }}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  editar: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  pref: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
});
