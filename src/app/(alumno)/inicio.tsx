import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Cabecera, Insignia, comun } from '@/components/ui';
import { C } from '@/constants/colores';
import { useApp } from '@/context/app-context';
import { ALUMNO } from '@/data/datos';

export default function Inicio() {
  const router = useRouter();
  const { solicitudes } = useApp();
  const mias = solicitudes.filter(s => s.matricula === ALUMNO.matricula);
  const stats = [
    { etiqueta: 'Activas', valor: mias.filter(s => s.estado !== 'entregado').length },
    { etiqueta: 'En preparación', valor: mias.filter(s => s.estado === 'preparacion').length },
    { etiqueta: 'Entregadas', valor: mias.filter(s => s.estado === 'entregado').length },
  ];
  const reciente = mias[mias.length - 1];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Cabecera>
        <Text style={styles.saludo}>BUENOS DÍAS</Text>
        <Text style={styles.nombre}>Sofía Ramírez</Text>
        <Text style={styles.sub}>Ing. Sistemas · Mat. {ALUMNO.matricula}</Text>
        <View style={styles.stats}>
          {stats.map(s => (
            <View key={s.etiqueta} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff' }}>{s.valor}</Text>
              <Text style={{ fontSize: 10, color: '#DDD6FE', marginTop: 2 }}>{s.etiqueta}</Text>
            </View>
          ))}
        </View>
      </Cabecera>

      <View style={{ paddingHorizontal: 20, marginTop: -18 }}>
        <TouchableOpacity style={[comun.boton, { backgroundColor: C.purpleL, elevation: 4 }]} onPress={() => router.push('/solicitar')}>
          <Text style={comun.botonTexto}>＋  Solicitar documento</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {reciente && (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMid }}>Solicitud reciente</Text>
              <TouchableOpacity onPress={() => router.push('/mis-solicitudes')}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: C.purpleL }}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[comun.tarjeta, { flexDirection: 'row', alignItems: 'center' }]}
              onPress={() => router.push({ pathname: '/mis-solicitudes', params: { id: reciente.id } })}>
              <View style={styles.icono}><Text style={{ fontSize: 18 }}>📄</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{reciente.documento}</Text>
                <Text style={{ fontSize: 12, color: C.textMute, marginVertical: 4 }}>{reciente.id} · {reciente.fecha}</Text>
                <Insignia estado={reciente.estado} />
              </View>
              <Text style={{ color: C.textMute, fontSize: 20 }}>›</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  saludo: { fontSize: 11, color: '#C4B5FD', fontWeight: '500', letterSpacing: 1 },
  nombre: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 2 },
  sub: { fontSize: 12, color: '#DDD6FE', marginTop: 2 },
  stats: { flexDirection: 'row', marginTop: 20 },
  icono: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
});
