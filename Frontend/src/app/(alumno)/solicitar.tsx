import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Boton, Encabezado, Fila, comun } from '@/components/ui';
import { C } from '@/constants/colores';
import { useApp } from '@/context/app-context';
import { useAuth } from '@/context/auth-context';
import { get, post } from '@/services/api';
import { Documento, Ficha } from '@/services/tipos';

type Paso = 'catalogo' | 'detalle' | 'confirmar' | 'exito';

const MAX_COPIAS = 3;  // solo se pueden hasta 3 copias por tramite

const dinero = (n: number | string) => `$${Number(n).toFixed(2)} MXN`;

export default function Solicitar() {
  const { usuario } = useAuth();
  const { crearSolicitud } = useApp();

  const [paso, setPaso] = useState<Paso>('catalogo');
  const [catalogo, setCatalogo] = useState<Documento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [doc, setDoc] = useState<Documento | null>(null);
  const [copias, setCopias] = useState(1);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  // Catálogo desde el servidor
  useEffect(() => {
    get<Documento[]>('/documentos')
      .then(setCatalogo)
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const total = doc ? Number(doc.costo) * copias : 0;

  function elegir(d: Documento) {
    setDoc(d);
    setCopias(1);
    setError('');
    setPaso('detalle');
  }

  async function confirmar() {
    if (!doc || enviando) return;
    if (!usuario) {
      setError('Tu sesión expiró. Vuelve a iniciar sesión.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const respuesta = await post<Ficha>('/solicitudes', {
        estudiante_id: usuario.id,
        documento_id: doc.id,
        copias,
      });
      setFicha(respuesta);
      // Mantiene al día las pantallas de seguimiento y avisos de la app.
      crearSolicitud(
        {
          id: String(doc.id),
          nombre: doc.nombre,
          descripcion: doc.descripcion,
          costo: Number(doc.costo),
          dias: doc.dias_estimados,
          icono: '',
          emoji: '📄',
        },
        copias,
      );
      setPaso('exito');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  // Catálogo
  if (paso === 'catalogo' || !doc) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Encabezado titulo="Solicitar documento" subtitulo="Elige el documento que necesitas" />
        <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
          {cargando && <ActivityIndicator color={C.purple} />}
          {!cargando && error !== '' && <Text style={styles.error}>{error}</Text>}
          {!cargando && error === '' && catalogo.length === 0 && (
            <Text style={{ textAlign: 'center', color: C.textMute }}>No hay documentos disponibles por ahora.</Text>
          )}
          {catalogo.map(d => (
            <TouchableOpacity key={d.id} style={[comun.tarjeta, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => elegir(d)}>
              <View style={styles.icono}><Text style={{ fontSize: 22 }}>📄</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>{d.nombre}</Text>
                <Text style={{ fontSize: 12, color: C.textMute, marginTop: 2 }}>{d.descripcion}</Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: C.purpleXL }}>{dinero(d.costo)}</Text>
                  <Text style={{ fontSize: 12, color: C.textMute }}>🕒 {d.dias_estimados} días</Text>
                </View>
              </View>
              <Text style={{ color: C.textMute, fontSize: 20 }}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Detalle: costo, copias y total
  if (paso === 'detalle') {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Encabezado titulo={doc.nombre} atras={() => setPaso('catalogo')} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.hero}>
            <View style={styles.heroIcono}><Text style={{ fontSize: 30 }}>📄</Text></View>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 8 }}>{doc.nombre}</Text>
            <Text style={{ fontSize: 14, color: '#DDD6FE', lineHeight: 20 }}>{doc.descripcion}</Text>
          </View>
          <View style={[comun.tarjeta, { paddingVertical: 4, marginBottom: 16 }]}>
            <Fila etiqueta="Costo" valor={dinero(doc.costo)} />
            <Fila etiqueta="Tiempo estimado" valor={`${doc.dias_estimados} días hábiles`} />
            <Fila etiqueta="Formato" valor={doc.formato} />
            {doc.vigencia_dias != null && <Fila etiqueta="Vigencia" valor={`${doc.vigencia_dias} días desde emisión`} />}
          </View>
          <View style={comun.tarjeta}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 12 }}>Número de copias</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={comun.circulo} onPress={() => setCopias(c => Math.max(1, c - 1))}>
                <Text style={{ fontSize: 20, color: C.purple }}>−</Text>
              </TouchableOpacity>
              <Text style={{ flex: 1, textAlign: 'center', fontSize: 24, fontWeight: '700', color: C.text }}>{copias}</Text>
              <TouchableOpacity style={[comun.circulo, { backgroundColor: C.purple }]} onPress={() => setCopias(c => Math.min(MAX_COPIAS, c + 1))}>
                <Text style={{ fontSize: 20, color: '#fff' }}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '700', color: C.purple, marginTop: 10 }}>Total: {dinero(total)}</Text>
          </View>
        </ScrollView>
        <View style={{ padding: 20 }}>
          <Boton texto={`Continuar — ${dinero(total)}`} onPress={() => setPaso('confirmar')} />
        </View>
      </View>
    );
  }

  // Confirmar: resumen antes de generar la ficha
  if (paso === 'confirmar') {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Encabezado titulo="Confirmar solicitud" atras={() => setPaso('detalle')} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.seccion}>Datos del estudiante</Text>
          <View style={[comun.tarjeta, { paddingVertical: 4, marginBottom: 20 }]}>
            <Fila etiqueta="Nombre" valor={usuario?.nombre ?? '—'} />
            <Fila etiqueta="Matrícula" valor={usuario?.matricula ?? '—'} />
            <Fila etiqueta="Correo" valor={usuario?.correo ?? '—'} />
          </View>
          <Text style={styles.seccion}>Detalle del documento</Text>
          <View style={[comun.tarjeta, { paddingVertical: 4, marginBottom: 20 }]}>
            <Fila etiqueta="Documento" valor={doc.nombre} />
            <Fila etiqueta="Copias" valor={String(copias)} />
            <Fila etiqueta="Importe" valor={dinero(total)} resaltar />
            <Fila etiqueta="Tiempo estimado" valor={`${doc.dias_estimados} días hábiles`} />
          </View>
          {error !== '' && <Text style={styles.error}>{error}</Text>}
        </ScrollView>
        <View style={{ padding: 20 }}>
          <Boton texto={enviando ? 'Generando ficha...' : 'Confirmar y generar ficha'} onPress={confirmar} />
        </View>
      </View>
    );
  }

  // Éxito: ficha de pago
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60, alignItems: 'center' }}>
        <View style={styles.exito}><Text style={{ fontSize: 36, color: C.green }}>✓</Text></View>
        <Text style={{ fontSize: 24, fontWeight: '700', color: C.text, marginBottom: 8 }}>Ficha generada</Text>
        <Text style={{ fontSize: 14, color: C.textMute, textAlign: 'center', lineHeight: 21, marginBottom: 24 }}>
          Paga con esta referencia antes de la fecha límite. Servicios Escolares procesará tu solicitud al validar el pago.
        </Text>
        {ficha && (
          <View style={[comun.tarjeta, { paddingVertical: 4, marginBottom: 24, alignSelf: 'stretch' }]}>
            <Fila etiqueta="Folio" valor={ficha.folio} />
            <Fila etiqueta="Referencia" valor={ficha.referencia} />
            <Fila etiqueta="Importe" valor={dinero(ficha.monto)} resaltar />
            <Fila etiqueta="Fecha límite" valor={String(ficha.fecha_limite).slice(0, 10)} />
          </View>
        )}
        <View style={{ alignSelf: 'stretch' }}>
          <Boton texto="Nueva solicitud" onPress={() => { setFicha(null); setPaso('catalogo'); }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  icono: { width: 48, height: 48, borderRadius: 16, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  hero: { backgroundColor: C.purple, borderRadius: 24, padding: 24, marginBottom: 20 },
  heroIcono: { width: 60, height: 60, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  seccion: { fontSize: 11, fontWeight: '600', color: C.purpleXL, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  exito: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  error: { color: C.red, textAlign: 'center', marginTop: 8 },
});
