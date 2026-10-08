import { ScrollView, Text, View } from 'react-native';

import { Encabezado, Insignia, comun } from '@/components/ui';
import { C } from '@/constants/colores';
import { useApp } from '@/context/app-context';
import { EstadoSolicitud, ORDEN_ESTADOS } from '@/data/datos';

export default function Estadisticas() {
  const { solicitudes } = useApp();
  const total = solicitudes.length;

  const porEstado: Record<EstadoSolicitud, number> = { solicitud: 0, preparacion: 0, listo: 0, entregado: 0 };
  const porDocumento: Record<string, number> = {};
  solicitudes.forEach(s => {
    porEstado[s.estado] += 1;
    porDocumento[s.documento] = (porDocumento[s.documento] || 0) + 1;
  });
  const masSolicitados = Object.entries(porDocumento).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const resumen = [
    { etiqueta: 'Total solicitudes', valor: total, color: C.purpleXL },
    { etiqueta: 'Entregadas', valor: porEstado.entregado, color: C.green },
    { etiqueta: 'En preparación', valor: porEstado.preparacion, color: '#60A5FA' },
    { etiqueta: 'Nuevas', valor: porEstado.solicitud, color: C.amber },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Encabezado titulo="Estadísticas" subtitulo="Resumen de solicitudes del período" />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {resumen.map(r => (
            <View key={r.etiqueta} style={[comun.tarjeta, { width: '47.5%' }]}>
              <Text style={{ fontSize: 26, fontWeight: '700', color: r.color, marginBottom: 4 }}>{r.valor}</Text>
              <Text style={{ fontSize: 12, color: C.textMute }}>{r.etiqueta}</Text>
            </View>
          ))}
        </View>

        <View style={comun.tarjeta}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 12 }}>Documentos más solicitados</Text>
          {masSolicitados.map(([nombre, cantidad]) => (
            <View key={nombre} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 12, color: C.textMute }}>{nombre}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: C.text }}>{cantidad}</Text>
              </View>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: C.border }}>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: C.purpleL, width: `${total ? (cantidad / total) * 100 : 0}%` }} />
              </View>
            </View>
          ))}
        </View>

        <View style={comun.tarjeta}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 8 }}>Estado de solicitudes</Text>
          {ORDEN_ESTADOS.map(e => (
            <View key={e} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <Insignia estado={e} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.text }}>{porEstado[e]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
