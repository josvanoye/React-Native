import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Encabezado, Insignia, comun } from '@/components/ui';
import { C } from '@/constants/colores';
import { useApp } from '@/context/app-context';
import { EstadoSolicitud, ETIQUETAS_ESTADO, ORDEN_ESTADOS } from '@/data/datos';

export default function Solicitudes() {
  const router = useRouter();
  const { solicitudes, avanzarEstado } = useApp();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<EstadoSolicitud | 'todas'>('todas');

  const b = busqueda.toLowerCase();
  const lista = solicitudes.filter(s => {
    const coincide = s.nombreAlumno.toLowerCase().includes(b) || s.matricula.includes(busqueda) || s.documento.toLowerCase().includes(b);
    return coincide && (filtro === 'todas' || s.estado === filtro);
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Encabezado titulo="Solicitudes" />
      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <TextInput
          style={[comun.input, { backgroundColor: C.cream, borderWidth: 0, paddingVertical: 11 }]}
          placeholder="🔍  Buscar por nombre, matrícula..."
          placeholderTextColor={C.textMute}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }} contentContainerStyle={{ gap: 8 }}>
          {(['todas', ...ORDEN_ESTADOS] as (EstadoSolicitud | 'todas')[]).map(f => (
            <TouchableOpacity key={f} onPress={() => setFiltro(f)} style={[styles.chip, { backgroundColor: filtro === f ? C.admin : C.cream }]}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: filtro === f ? '#fff' : C.textMute }}>
                {f === 'todas' ? 'Todas' : ETIQUETAS_ESTADO[f]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }}>
        {lista.length === 0 && <Text style={{ textAlign: 'center', color: C.textMute, marginTop: 60 }}>Sin resultados</Text>}
        {lista.map(s => {
          const siguiente = ORDEN_ESTADOS[ORDEN_ESTADOS.indexOf(s.estado) + 1];
          return (
            <View key={s.id} style={[comun.tarjeta, { padding: 0, overflow: 'hidden' }]}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
                onPress={() => router.push({ pathname: '/detalle', params: { id: s.id } })}>
                <View style={styles.icono}><Text style={{ fontSize: 16 }}>📄</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{s.nombreAlumno}</Text>
                  <Text style={{ fontSize: 12, color: C.textMute }}>{s.matricula} · {s.documento}</Text>
                  <Text style={{ fontSize: 12, color: C.textMute, marginBottom: 6 }}>{s.fecha}</Text>
                  <Insignia estado={s.estado} />
                </View>
                <Text style={{ color: C.textMute, fontSize: 20 }}>›</Text>
              </TouchableOpacity>
              {siguiente && (
                <View style={{ borderTopWidth: 1, borderTopColor: C.border, padding: 12 }}>
                  <TouchableOpacity onPress={() => avanzarEstado(s.id)} style={{ backgroundColor: C.cream, borderRadius: 12, paddingVertical: 9, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: C.purpleXL }}>Avanzar → {ETIQUETAS_ESTADO[siguiente]}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 13, paddingVertical: 6, borderRadius: 20 },
  icono: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
});
