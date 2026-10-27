import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { Cabecera, comun } from '@/components/ui';
import { C } from '@/constants/colores';

export default function PerfilAdmin() {
  const router = useRouter();
  const [alertas, setAlertas] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Cabecera fondo={C.admin}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff' }}>Mi perfil</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <View style={styles.avatar}><Text style={{ fontSize: 30 }}>🏫</Text></View>
          <View>
            <Text style={{ fontSize: 17, fontWeight: '600', color: '#fff' }}>Lic. Ana González R.</Text>
            <Text style={{ fontSize: 12, color: '#DDD6FE' }}>Jefa de Servicios Escolares</Text>
            <Text style={{ fontSize: 12, color: '#DDD6FE' }}>ana.gonzalez@uni.edu.mx</Text>
          </View>
        </View>
      </Cabecera>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={[comun.tarjeta, { paddingVertical: 4 }]}>
          {['✉️  ana.gonzalez@uni.edu.mx', '📞  +52 (55) 9876 5432', '🏫  Universidad Politécnica de México'].map(t => (
            <Text key={t} style={{ fontSize: 14, color: C.text, paddingVertical: 12 }}>{t}</Text>
          ))}
        </View>

        <View style={[comun.tarjeta, { paddingVertical: 4 }]}>
          <Text style={[comun.etiqueta, { marginTop: 12 }]}>Preferencias</Text>
          <View style={styles.pref}>
            <Text style={{ fontSize: 14, color: C.text }}>🔔  Alertas del sistema</Text>
            <Switch value={alertas} onValueChange={setAlertas} trackColor={{ false: C.border, true: C.purpleL }} thumbColor="#fff" />
          </View>
          {['✏️  Editar datos personales', '⚙️  Cambiar contraseña'].map(t => (
            <View key={t} style={[styles.pref, { paddingVertical: 14 }]}>
              <Text style={{ fontSize: 14, color: C.text }}>{t}</Text>
              <Text style={{ color: C.textMute, fontSize: 18 }}>›</Text>
            </View>
          ))}
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
  pref: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
});
