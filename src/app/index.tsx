// ================== PANTALLA DE LOGIN (pantalla principal de la app) ==================
// Como este archivo se llama "index.tsx" y está en la raíz de src/app,
// Expo Router lo usa como la primera pantalla que se abre (la ruta "/").

// useRouter nos sirve para cambiar de pantalla desde el código
import { useRouter } from 'expo-router';
// useState sirve para guardar valores que cambian (lo que escribe el usuario, el mensaje de error)
import { useState } from 'react';
// Componentes básicos de React Native (son el equivalente a las etiquetas HTML):
// Alert = ventanita de aviso
// KeyboardAvoidingView = evita que el teclado tape los campos
// Platform = nos dice si estamos en iPhone o Android
// ScrollView = contenedor que permite hacer scroll
// StyleSheet = para escribir los estilos
// Text = para mostrar texto
// TextInput = campo donde el usuario escribe
// TouchableOpacity = botón o texto que se puede presionar
// View = contenedor (como un div)
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Nos da el tamaño de las zonas del celular que no se pueden usar (notch, barra de estado)
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Boton = botón morado reutilizable, comun = estilos que se repiten en las pantallas
// (los dos están en src/components/ui.tsx)
import { Boton, comun } from '@/components/ui';
// C = objeto con todos los colores de la app (está en src/constants/colores.ts)
import { C } from '@/constants/colores';
// Usuarios de prueba (están en src/data/datos.ts), mientras no exista el backend
import { USUARIOS_PRUEBA } from '@/data/datos';

// "export default" = esta es la pantalla que Expo Router va a mostrar
export default function Login() {
  // Guardamos el router en una variable para poder usar router.push
  const router = useRouter();
  // Medidas de las zonas seguras del celular (insets.top = espacio de arriba)
  const insets = useSafeAreaInsets();
  // Lo que el usuario escribe en el campo de matrícula o correo (empieza vacío)
  const [cuenta, setCuenta] = useState('');
  // Lo que el usuario escribe en el campo de contraseña (empieza vacío)
  const [password, setPassword] = useState('');
  // Mensaje de error que se muestra abajo del botón (empieza vacío = no se ve)
  const [error, setError] = useState('');

  // Esta función se ejecuta cuando el usuario presiona "Iniciar sesión"
  function iniciarSesion() {
    // Quitamos espacios al inicio y al final y pasamos todo a minúsculas
    const c = cuenta.trim().toLowerCase();
    // Si falta la cuenta o la contraseña...
    if (!c || !password) {
      // ...mostramos este mensaje
      setError('Completa todos los campos');
      // ...y salimos de la función para no seguir revisando
      return;
    }
    // Usuarios de prueba, aquí después se conecta el backend
    // Si la cuenta es la matrícula del alumno (o su correo) y la contraseña es correcta...
    if ((c === USUARIOS_PRUEBA.alumno.cuenta || c === 'sofia.ramirez@uni.edu.mx') && password === USUARIOS_PRUEBA.alumno.password) {
      // ...borramos cualquier error anterior
      setError('');
      // ...y mostramos un aviso. Aquí después se manda a la pantalla principal del alumno
      Alert.alert('Bienvenida', 'Inicio de sesión correcto (alumno)');
      // Salimos de la función
      return;
    }
    // Si la cuenta es la del administrador y la contraseña es correcta...
    if (c === USUARIOS_PRUEBA.admin.cuenta && password === USUARIOS_PRUEBA.admin.password) {
      // ...borramos cualquier error anterior
      setError('');
      // ...y mostramos un aviso. Aquí después se manda al panel del administrador
      Alert.alert('Bienvenida', 'Inicio de sesión correcto (administrador)');
      // Salimos de la función
      return;
    }
    // Si no coincidió con ningún usuario, mostramos el error
    setError('Matrícula o contraseña incorrectas');
  }

  // Lo que se ve en pantalla (se escribe con JSX, parecido a HTML)
  return (
    // Contenedor que sube el contenido cuando aparece el teclado
    <KeyboardAvoidingView
      // flex: 1 = ocupa toda la pantalla, y el fondo es morado
      style={{ flex: 1, backgroundColor: C.purple }}
      // En iPhone se usa 'padding' para subir el contenido, en Android no hace falta
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Permite hacer scroll si la pantalla es chica; flexGrow: 1 hace que llene toda la pantalla */}
      {/* keyboardShouldPersistTaps="handled" deja presionar botones sin cerrar el teclado primero */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

        {/* ---------- PARTE DE ARRIBA (fondo morado con el nombre de la app) ---------- */}
        {/* Usamos dos estilos: el de styles.arriba y un paddingTop que deja espacio para la barra de estado */}
        <View style={[styles.arriba, { paddingTop: insets.top + 32 }]}>
          {/* Cuadrito del logo */}
          <View style={styles.logo}>
            {/* Emoji que hace de logo */}
            <Text style={{ fontSize: 26 }}>📄</Text>
          </View>
          {/* Nombre de la app */}
          <Text style={styles.nombre}>PoliDocs</Text>
          {/* Frase debajo del nombre */}
          <Text style={styles.sub}>Gestión de documentos académicos</Text>
        </View>

        {/* ---------- PARTE DE ABAJO (tarjeta clara con el formulario) ---------- */}
        <View style={styles.formulario}>
          {/* Título del primer campo */}
          <Text style={comun.etiqueta}>Matrícula o correo institucional</Text>
          {/* Campo donde se escribe la matrícula o el correo */}
          <TextInput
            // Estilo común de los campos de texto
            style={comun.input}
            // El valor que se muestra es el que guardamos en el estado "cuenta"
            value={cuenta}
            // Cada vez que el usuario escribe, actualizamos el estado
            onChangeText={setCuenta}
            // Texto gris que se ve cuando el campo está vacío
            placeholder="Ingresa tu matrícula o correo"
            // Color de ese texto gris
            placeholderTextColor={C.textMute}
            // Evita que el teclado ponga la primera letra en mayúscula (importante en correos)
            autoCapitalize="none"
          />
          {/* Título del segundo campo, con un margen arriba para separarlo del primero */}
          <Text style={[comun.etiqueta, { marginTop: 16 }]}>Contraseña</Text>
          {/* Campo de la contraseña */}
          <TextInput
            // Estilo común de los campos de texto
            style={comun.input}
            // El valor viene del estado "password"
            value={password}
            // Cada vez que escribe, actualizamos el estado
            onChangeText={setPassword}
            // Texto gris cuando está vacío
            placeholder="Ingresa tu contraseña"
            // Color de ese texto gris
            placeholderTextColor={C.textMute}
            // Muestra puntitos en lugar de las letras
            secureTextEntry
          />
          {/* Texto presionable "¿Olvidaste tu contraseña?" (todavía no hace nada) */}
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginVertical: 12 }}>
            {/* Letra morada, tamaño 13 */}
            <Text style={{ color: C.purpleL, fontSize: 13, fontWeight: '500' }}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Botón morado; al presionarlo se ejecuta la función iniciarSesion de arriba */}
          <Boton texto="Iniciar sesión" onPress={iniciarSesion} />

          {/* Si "error" tiene texto, se muestra en rojo; si está vacío no se dibuja nada */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Fila con "¿No tienes cuenta? Crear cuenta" */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 18 }}>
            {/* Texto normal */}
            <Text style={{ color: C.textMute, fontSize: 13 }}>¿No tienes cuenta? </Text>
            {/* Al presionar "Crear cuenta" vamos a la pantalla registro.tsx.
                Usamos push para que se pueda regresar con el botón de atrás */}
            <TouchableOpacity onPress={() => router.push('/registro')}>
              {/* Texto morado en negritas */}
              <Text style={{ color: C.purpleL, fontSize: 13, fontWeight: '600' }}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos de esta pantalla (los que no se repiten en otras)
const styles = StyleSheet.create({
  // Parte morada de arriba: contenido centrado, espacio abajo y a los lados
  arriba: { alignItems: 'center', paddingBottom: 28, paddingHorizontal: 32 },
  // Cuadrito del logo: 48x48, esquinas redondeadas, blanco semitransparente, emoji centrado
  logo: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  // Nombre "PoliDocs": grande, en negritas y blanco
  nombre: { fontSize: 26, fontWeight: '700', color: '#fff' },
  // Frase de abajo: pequeña, morado claro, separada un poco del nombre
  sub: { fontSize: 13, color: '#DDD6FE', marginTop: 4 },
  // Tarjeta del formulario: ocupa el resto de la pantalla, fondo crema, esquinas de arriba redondeadas
  formulario: { flex: 1, backgroundColor: C.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingTop: 28 },
  // Mensaje de error: rojo, centrado y con espacio arriba
  error: { color: C.red, fontSize: 13, fontWeight: '500', textAlign: 'center', marginTop: 14 },
});
