import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Encabezado, Insignia, comun } from '@/components/ui';
import { C } from '@/constants/colores';
import { useApp } from '@/context/app-context';

export default function Panel() {
  const router = useRouter();
  const { solicitudes } = useApp();
  const nuevas = solicitudes.filter(s => s.estado === 'solicitud').length;
  const enPrep = solicitudes.filter(s => s.estado === 'preparacion').length;
  const listas = solicitudes.filter(s => s.estado === 'listo').length;
  const recientes = [...solicitudes].reverse().slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Encabezado titulo="Servicios Escolares" subtitulo="Panel administrativo" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={[comun.tarjeta, { marginBottom: 24 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 12, color: C.textMute }}>Solicitudes totales</Text>
              <Text style={{ fontSize: 30, fontWeight: '600', color: C.text }}>{solicitudes.length}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/solicitudes')} style={{ backgroundColor: C.cream, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: C.purpleXL }}>Ver solicitudes</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12 }}>
            {[['Nuevas', nuevas], ['En preparación', enPrep], ['Listas', listas]].map(([e, v]) => (
              <View key={e} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: C.text }}>{v}</Text>
                <Text style={{ fontSize: 10, color: C.textMute, marginTop: 2 }}>{e}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMid }}>Actividad reciente</Text>
          <TouchableOpacity onPress={() => router.push('/solicitudes')}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: C.purpleL }}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        <View style={[comun.tarjeta, { padding: 0, overflow: 'hidden' }]}>
          {recientes.map(s => (
            <TouchableOpacity
              key={s.id}
              onPress={() => router.push({ pathname: '/detalle', params: { id: s.id } })}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: C.text }}>{s.nombreAlumno}</Text>
                <Text style={{ fontSize: 12, color: C.textMute, marginTop: 2 }}>{s.documento} · {s.fecha}</Text>
              </View>
              <Insignia estado={s.estado} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
