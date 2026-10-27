import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Boton, Encabezado, Fila, Insignia, comun } from '@/components/ui';
import { C } from '@/constants/colores';
import { useApp } from '@/context/app-context';
import { ETIQUETAS_ESTADO, ORDEN_ESTADOS } from '@/data/datos';

export default function Detalle() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { solicitudes, avanzarEstado } = useApp();
  const sol = solicitudes.find(s => s.id === id);
  const [obs, setObs] = useState(sol?.observaciones ?? '');
  const [historial, setHistorial] = useState(false);

  if (!sol) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Encabezado titulo="Detalle" atras={() => router.back()} />
        <Text style={{ textAlign: 'center', color: C.textMute, marginTop: 60 }}>Solicitud no encontrada</Text>
      </View>
    );
  }

  const actual = ORDEN_ESTADOS.indexOf(sol.estado);
  const siguiente = ORDEN_ESTADOS[actual + 1];

  function avanzar() {
    avanzarEstado(sol!.id, obs);
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Encabezado titulo="Detalle" atras={() => router.back()} derecha={<Insignia estado={sol.estado} />} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={comun.tarjeta}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 18 }}>🎓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{sol.nombreAlumno}</Text>
              <Text style={{ fontSize: 12, color: C.textMute }}>{sol.carrera}</Text>
            </View>
          </View>
          <Fila etiqueta="Matrícula" valor={sol.matricula} />
          <Fila etiqueta="Semestre" valor={sol.semestre} />
          <Fila etiqueta="Correo" valor={sol.correo} />
        </View>

        <View style={comun.tarjeta}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 4 }}>{sol.documento}</Text>
          <Fila etiqueta="ID" valor={sol.id} />
          <Fila etiqueta="Copias" valor={String(sol.copias)} />
          <Fila etiqueta="Fecha de solicitud" valor={sol.fecha} />
        </View>

        <TouchableOpacity style={[comun.tarjeta, { flexDirection: 'row', justifyContent: 'space-between' }]} onPress={() => setHistorial(v => !v)}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>Historial de estados</Text>
          <Text style={{ color: C.textMute }}>{historial ? '⌄' : '›'}</Text>
        </TouchableOpacity>
        {historial && (
          <View style={comun.tarjeta}>
            {ORDEN_ESTADOS.slice(0, actual + 1).map(e => (
              <View key={e} style={{ paddingVertical: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>✓  {ETIQUETAS_ESTADO[e]}</Text>
                <Text style={{ fontSize: 12, color: C.textMute, marginLeft: 20 }}>{sol.fecha}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={comun.tarjeta}>
          <Text style={comun.etiqueta}>Observaciones</Text>
          <TextInput
            value={obs}
            onChangeText={setObs}
            multiline
            numberOfLines={3}
            placeholder="Agregar nota interna..."
            placeholderTextColor={C.textMute}
            style={{ fontSize: 14, color: C.text, minHeight: 60, textAlignVertical: 'top' }}
          />
        </View>
      </ScrollView>

      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg }}>
        <View style={{ flexDirection: 'row', gap: 4, marginBottom: 8 }}>
          {ORDEN_ESTADOS.map((e, i) => (
            <View key={e} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= actual ? C.purpleL : C.border }} />
          ))}
        </View>
        <Text style={{ fontSize: 12, fontWeight: '500', color: C.textMute, textAlign: 'center', marginBottom: 12 }}>
          Paso {actual + 1} de {ORDEN_ESTADOS.length} · {ETIQUETAS_ESTADO[sol.estado]}
        </Text>
        {siguiente ? (
          <Boton texto={`Marcar como: ${ETIQUETAS_ESTADO[siguiente]}`} onPress={avanzar} color={C.admin} />
        ) : (
          <View style={{ backgroundColor: '#DCFCE7', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: C.green, fontWeight: '500', fontSize: 14 }}>✓  Proceso completado</Text>
          </View>
        )}
      </View>
    </View>
  );
}
