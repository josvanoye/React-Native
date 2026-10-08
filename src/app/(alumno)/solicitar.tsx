import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Boton, Encabezado, Fila, comun } from '@/components/ui';
import { C } from '@/constants/colores';
import { useApp } from '@/context/app-context';
import { ALUMNO, DOCUMENTOS, DocumentoTipo } from '@/data/datos';

type Paso = 'catalogo' | 'detalle' | 'confirmar' | 'exito';

export default function Solicitar() {
  const { crearSolicitud } = useApp();
  const [paso, setPaso] = useState<Paso>('catalogo');
  const [doc, setDoc] = useState<DocumentoTipo | null>(null);
  const [copias, setCopias] = useState(1);

  function elegir(d: DocumentoTipo) {
    setDoc(d);
    setCopias(1);
    setPaso('detalle');
  }

  function confirmar() {
    if (!doc) return;
    crearSolicitud(doc, copias);
    setPaso('exito');
  }

  // Catálogo
  if (paso === 'catalogo' || !doc) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Encabezado titulo="Solicitar documento" subtitulo="Elige el documento que necesitas" />
        <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
          {DOCUMENTOS.map(d => (
            <TouchableOpacity key={d.id} style={[comun.tarjeta, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => elegir(d)}>
              <View style={styles.icono}><Text style={{ fontSize: 22 }}>{d.emoji}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{d.nombre}</Text>
                <Text style={{ fontSize: 12, color: C.textMute, marginTop: 2 }}>{d.descripcion}</Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: C.purpleXL }}>${d.costo} MXN</Text>
                  <Text style={{ fontSize: 12, color: C.textMute }}>🕒 {d.dias} días</Text>
                </View>
              </View>
              <Text style={{ color: C.textMute, fontSize: 20 }}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Detalle
  if (paso === 'detalle') {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Encabezado titulo={doc.nombre} atras={() => setPaso('catalogo')} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.hero}>
            <View style={styles.heroIcono}><Text style={{ fontSize: 30 }}>{doc.emoji}</Text></View>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 8 }}>{doc.nombre}</Text>
            <Text style={{ fontSize: 14, color: '#DDD6FE', lineHeight: 20 }}>{doc.descripcion}</Text>
          </View>
          <View style={[comun.tarjeta, { paddingVertical: 4, marginBottom: 16 }]}>
            <Fila etiqueta="Costo" valor={`$${doc.costo}.00 MXN`} />
            <Fila etiqueta="Tiempo estimado" valor={`${doc.dias} días hábiles`} />
            <Fila etiqueta="Entrega" valor="Documento impreso en ventanilla" />
            <Fila etiqueta="Vigencia" valor="90 días desde emisión" />
          </View>
          <View style={comun.tarjeta}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 12 }}>Número de copias</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={comun.circulo} onPress={() => setCopias(c => Math.max(1, c - 1))}>
                <Text style={{ fontSize: 20, color: C.purple }}>−</Text>
              </TouchableOpacity>
              <Text style={{ flex: 1, textAlign: 'center', fontSize: 24, fontWeight: '700', color: C.text }}>{copias}</Text>
              <TouchableOpacity style={[comun.circulo, { backgroundColor: C.purple }]} onPress={() => setCopias(c => Math.min(5, c + 1))}>
                <Text style={{ fontSize: 20, color: '#fff' }}>+</Text>
              </TouchableOpacity>
            </View>
            {copias > 1 && <Text style={{ textAlign: 'center', fontSize: 12, color: C.textMute, marginTop: 8 }}>Total: ${doc.costo * copias}.00 MXN</Text>}
          </View>
        </ScrollView>
        <View style={{ padding: 20 }}>
          <Boton texto={`Continuar — $${doc.costo * copias} MXN`} onPress={() => setPaso('confirmar')} />
        </View>
      </View>
    );
  }

  // Confirmar
  if (paso === 'confirmar') {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Encabezado titulo="Confirmar solicitud" atras={() => setPaso('detalle')} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.seccion}>Datos del estudiante</Text>
          <View style={[comun.tarjeta, { paddingVertical: 4, marginBottom: 20 }]}>
            <Fila etiqueta="Nombre" valor={ALUMNO.nombre} />
            <Fila etiqueta="Matrícula" valor={ALUMNO.matricula} />
            <Fila etiqueta="Carrera" valor={ALUMNO.carrera} />
            <Fila etiqueta="Semestre" valor={ALUMNO.semestre} />
            <Fila etiqueta="Correo" valor={ALUMNO.correo} />
          </View>
          <Text style={styles.seccion}>Detalle del documento</Text>
          <View style={[comun.tarjeta, { paddingVertical: 4, marginBottom: 20 }]}>
            <Fila etiqueta="Documento" valor={doc.nombre} />
            <Fila etiqueta="Copias" valor={String(copias)} />
            <Fila etiqueta="Importe" valor={`$${doc.costo * copias}.00 MXN`} resaltar />
            <Fila etiqueta="Tiempo estimado" valor={`${doc.dias} días hábiles`} />
          </View>
          <View style={styles.aviso}>
            <Text style={{ fontSize: 12, color: C.green, lineHeight: 18 }}>
              Al confirmar tu solicitud, Servicios Escolares la recibirá y comenzará a procesarla.
            </Text>
          </View>
        </ScrollView>
        <View style={{ padding: 20 }}>
          <Boton texto="Confirmar solicitud" onPress={confirmar} />
        </View>
      </View>
    );
  }

  // Éxito
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <View style={styles.exito}><Text style={{ fontSize: 36, color: C.green }}>✓</Text></View>
      <Text style={{ fontSize: 24, fontWeight: '700', color: C.text, marginBottom: 8 }}>Solicitud enviada</Text>
      <Text style={{ fontSize: 14, color: C.textMute, textAlign: 'center', lineHeight: 21, marginBottom: 32 }}>
        Tu solicitud fue recibida. Servicios Escolares la procesará y te notificará cuando esté lista.
      </Text>
      <View style={{ alignSelf: 'stretch' }}>
        <Boton texto="Nueva solicitud" onPress={() => setPaso('catalogo')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icono: { width: 48, height: 48, borderRadius: 16, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  hero: { backgroundColor: C.purple, borderRadius: 24, padding: 24, marginBottom: 20 },
  heroIcono: { width: 60, height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  seccion: { fontSize: 11, fontWeight: '600', color: C.purpleXL, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  aviso: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 16, padding: 16 },
  exito: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
});
