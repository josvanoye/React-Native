import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Encabezado, Insignia, comun } from '@/components/ui';
import { C } from '@/constants/colores';
import { useApp } from '@/context/app-context';
import { ALUMNO, EstadoSolicitud, ETIQUETAS_ESTADO, ORDEN_ESTADOS } from '@/data/datos';

type Filtro = 'todas' | 'activas' | 'entregadas';

const DESCRIPCION: Record<EstadoSolicitud, string> = {
  solicitud: 'Tu solicitud fue recibida por Servicios Escolares.',
  preparacion: 'El documento está siendo preparado.',
  listo: 'Preséntate en ventanilla 3 con tu identificación.',
  entregado: 'Documento entregado exitosamente.',
};

export default function MisSolicitudes() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { solicitudes } = useApp();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [seleccionada, setSeleccionada] = useState<string | null>(null);

  // Si llegamos desde avisos o inicio con un id, abrimos el seguimiento
  useEffect(() => {
    if (id) setSeleccionada(id);
  }, [id]);

  const mias = solicitudes.filter(s => s.matricula === ALUMNO.matricula);
  const lista = mias.filter(s => {
    if (filtro === 'activas') return s.estado !== 'entregado';
    if (filtro === 'entregadas') return s.estado === 'entregado';
    return true;
  });
  const sol = solicitudes.find(s => s.id === seleccionada);

  // Seguimiento
  if (sol) {
    const actual = ORDEN_ESTADOS.indexOf(sol.estado);
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Encabezado titulo="Seguimiento" atras={() => setSeleccionada(null)} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={[comun.tarjeta, { marginBottom: 24 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: C.text }}>{sol.documento}</Text>
                <Text style={{ fontSize: 12, color: C.textMute, marginTop: 2 }}>{sol.id} · {sol.fecha}</Text>
              </View>
              <Insignia estado={sol.estado} />
            </View>
            {sol.estado === 'solicitud' && (
              <View style={[styles.nota, { backgroundColor: '#FEFCE8', borderColor: '#FEF08A' }]}>
                <Text style={{ fontSize: 12, color: C.amber }}>Solicitud recibida. Servicios Escolares comenzará a procesarla en breve.</Text>
              </View>
            )}
            {sol.estado === 'entregado' && (
              <View style={[styles.nota, { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0' }]}>
                <Text style={{ fontSize: 12, color: C.green }}>Documento entregado en ventanilla.</Text>
              </View>
            )}
          </View>

          <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMid, marginBottom: 16 }}>Estado del proceso</Text>
          {ORDEN_ESTADOS.map((paso, i) => {
            const hecho = i <= actual;
            const esActual = i === actual;
            return (
              <View key={paso} style={{ flexDirection: 'row', opacity: hecho ? 1 : 0.4 }}>
                <View style={{ alignItems: 'center', marginRight: 14 }}>
                  <View style={[styles.punto, { backgroundColor: hecho ? (esActual ? C.purpleL : C.purple) : C.card, borderColor: hecho ? (esActual ? C.purpleL : C.purple) : C.border }]}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>{hecho && !esActual ? '✓' : ''}</Text>
                  </View>
                  {i < ORDEN_ESTADOS.length - 1 && <View style={{ width: 2, flex: 1, minHeight: 28, backgroundColor: i < actual ? C.purpleL : C.border }} />}
                </View>
                <View style={{ flex: 1, paddingBottom: 20 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: esActual ? C.purpleXL : C.text }}>{ETIQUETAS_ESTADO[paso]}</Text>
                  {hecho && <Text style={{ fontSize: 12, color: C.textMute, marginTop: 2 }}>{DESCRIPCION[paso]}</Text>}
                  {esActual && sol.observaciones ? <Text style={{ fontSize: 12, color: C.textMid, marginTop: 6 }}>Nota: {sol.observaciones}</Text> : null}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // Lista
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Encabezado titulo="Mis solicitudes" />
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 12 }}>
        {(['todas', 'activas', 'entregadas'] as Filtro[]).map(f => (
          <TouchableOpacity key={f} onPress={() => setFiltro(f)} style={[styles.chip, { backgroundColor: filtro === f ? C.purple : C.cream }]}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: filtro === f ? '#fff' : C.textMute }}>
              {f === 'todas' ? 'Todas' : f === 'activas' ? 'En proceso' : 'Entregadas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, gap: 12 }}>
        {lista.length === 0 && <Text style={{ textAlign: 'center', color: C.textMute, marginTop: 60 }}>Sin solicitudes</Text>}
        {lista.map(s => (
          <TouchableOpacity key={s.id} style={[comun.tarjeta, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => setSeleccionada(s.id)}>
            <View style={styles.icono}><Text style={{ fontSize: 18 }}>📄</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{s.documento}</Text>
              <Text style={{ fontSize: 12, color: C.textMute, marginVertical: 4 }}>{s.id} · {s.fecha}</Text>
              <Insignia estado={s.estado} />
            </View>
            <Text style={{ color: C.textMute, fontSize: 20 }}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  nota: { borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 12 },
  punto: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  icono: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
});
