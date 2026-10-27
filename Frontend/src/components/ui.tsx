import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C } from '@/constants/colores';
import { ETIQUETAS_ESTADO } from '@/data/datos';

export const comun = StyleSheet.create({
  etiqueta: {
    fontSize: 11,
    fontWeight: '600',
    color: C.textMute,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: C.text,
  },
  boton: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  tarjeta: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  circulo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function Boton({
  texto,
  onPress,
  color = C.purple,
}: {
  texto: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity
      style={[comun.boton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={comun.botonTexto}>{texto}</Text>
    </TouchableOpacity>
  );
}

export function Cabecera({
  fondo = C.purple,
  children,
}: {
  fondo?: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: fondo,
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 24,
      }}
    >
      {children}
    </View>
  );
}

export function Encabezado({
  titulo,
  subtitulo,
  atras,
  derecha,
  fondo = C.purple,
}: {
  titulo: string;
  subtitulo?: string;
  atras?: () => void;
  derecha?: ReactNode;
  fondo?: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: fondo,
        paddingTop: insets.top + 12,
        paddingHorizontal: 20,
        paddingBottom: 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {atras && (
          <TouchableOpacity onPress={atras} style={{ marginRight: 12, paddingVertical: 4 }}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>‹</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff' }}>{titulo}</Text>
          {subtitulo && (
            <Text style={{ fontSize: 12, color: '#DDD6FE', marginTop: 2 }}>{subtitulo}</Text>
          )}
        </View>
        {derecha && <View>{derecha}</View>}
      </View>
    </View>
  );
}

export function Fila({
  etiqueta,
  valor,
  resaltar = false,
}: {
  etiqueta: string;
  valor: string;
  resaltar?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
      }}
    >
      <Text style={{ fontSize: 13, color: C.textMute }}>{etiqueta}</Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: resaltar ? '700' : '500',
          color: resaltar ? C.purpleL : C.text,
        }}
      >
        {valor}
      </Text>
    </View>
  );
}

const COLORES_ESTADO: Record<string, { bg: string; texto: string }> = {
  solicitud: { bg: '#EFF6FF', texto: '#1D4ED8' },
  revision: { bg: '#FEF3C7', texto: '#B45309' },
  pago: { bg: '#FEE2E2', texto: '#B91C1C' },
  preparacion: { bg: '#F3E8FF', texto: '#7C3AED' },
  listo: { bg: '#D1FAE5', texto: '#047857' },
  entregado: { bg: '#E5E7EB', texto: '#374151' },
};

export function Insignia({ estado }: { estado: string }) {
  const c = COLORES_ESTADO[estado] || { bg: '#F3F4F6', texto: '#4B5563' };
  const etiqueta = (ETIQUETAS_ESTADO as Record<string, string>)[estado] || estado;
  return (
    <View
      style={{
        backgroundColor: c.bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: c.texto, fontSize: 11, fontWeight: '600' }}>
        {etiqueta}
      </Text>
    </View>
  );
}

export function icono(simbolo: string) {
  return function TabIcon() {
    return <Text style={{ fontSize: 18 }}>{simbolo}</Text>;
  };
}
