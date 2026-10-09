import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Encabezado } from '@/components/ui';
import { C } from '@/constants/colores';
import { useApp } from '@/context/app-context';

export default function Avisos() {
  const router = useRouter();
  const { avisos, noLeidos, marcarAvisosLeidos } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Encabezado
        titulo="Notificaciones"
        subtitulo={noLeidos > 0 ? `${noLeidos} sin leer` : undefined}
      />
      {noLeidos > 0 && (
        <TouchableOpacity onPress={marcarAvisosLeidos} style={{ alignSelf: 'flex-end', paddingHorizontal: 20, paddingTop: 10 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: C.purpleL }}>Marcar leídas</Text>
        </TouchableOpacity>
      )}
      <ScrollView>
        {avisos.length === 0 && <Text style={{ textAlign: 'center', color: C.textMute, marginTop: 80 }}>Sin notificaciones</Text>}
        {avisos.map(a => (
          <TouchableOpacity
            key={a.id}
            onPress={() => a.solicitudId && router.push({ pathname: '/mis-solicitudes', params: { id: a.solicitudId } })}
            style={{ flexDirection: 'row', padding: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: a.leido ? 'transparent' : 'rgba(109,40,217,0.05)' }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Text style={{ fontSize: 16 }}>🔔</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{a.titulo}</Text>
                {!a.leido && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.purpleL, marginTop: 5 }} />}
              </View>
              <Text style={{ fontSize: 12, color: C.textMute, marginTop: 4, lineHeight: 18 }}>{a.texto}</Text>
              <Text style={{ fontSize: 12, color: C.textMute, marginTop: 6 }}>{a.hora}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
