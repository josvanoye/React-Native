// Piezas reutilizables que usan el login y el registro.

// ReactNode = tipo que representa "cualquier cosa que se pueda dibujar" (lo usamos en children)
import { ReactNode } from 'react';
// Componentes básicos de React Native
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Nos da el tamaño de las zonas del celular que no se pueden usar (notch, barra de estado)
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Colores de la app
import { C } from '@/constants/colores';

// Estilos que se repiten en las dos pantallas
export const comun = StyleSheet.create({
  // Título pequeño que va arriba de cada campo (en mayúsculas, gris morado)
  etiqueta: { fontSize: 11, fontWeight: '600', color: C.textMute, marginBottom: 6, textTransform: 'uppercase' },
  // Campo de texto: fondo blanco, borde suave, esquinas redondeadas y espacio adentro
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: C.text },
  // Forma del botón: esquinas redondeadas, espacio arriba y abajo, texto centrado
  boton: { borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  // Texto del botón: blanco y en negritas
  botonTexto: { color: '#fff', fontWeight: '600', fontSize: 15 },
});

// Botón reutilizable. Recibe el texto, la función que se ejecuta al presionarlo y el color (morado por defecto)
export function Boton({ texto, onPress, color = C.purple }: { texto: string; onPress: () => void; color?: string }) {
  return (
    // TouchableOpacity = se hace más transparente al presionarlo
    <TouchableOpacity style={[comun.boton, { backgroundColor: color }]} onPress={onPress}>
      {/* Texto del botón */}
      <Text style={comun.botonTexto}>{texto}</Text>
    </TouchableOpacity>
  );
}

// Parte de arriba con fondo de color (se usa en la pantalla de registro)
export function Cabecera({ fondo = C.purple, children }: { fondo?: string; children: ReactNode }) {
  // Espacio de la barra de estado del celular, para que el contenido no quede debajo
  const insets = useSafeAreaInsets();
  return (
    // children = lo que pongamos dentro de <Cabecera> ... </Cabecera>
    <View style={{ backgroundColor: fondo, paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 24 }}>
      {children}
    </View>
  );
}
