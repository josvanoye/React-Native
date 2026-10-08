// ================== PANTALLA DE CREAR CUENTA ==================
// Como el archivo se llama "registro.tsx", Expo Router crea la ruta "/registro".
// Se llega a ella desde el login con router.push('/registro').

// useRouter nos sirve para cambiar de pantalla o regresar
import { useRouter } from 'expo-router';
// useState sirve para guardar valores que cambian (lo que escribe el usuario, el error)
import { useState } from 'react';
// Componentes básicos de React Native:
// Alert = ventanita de aviso
// KeyboardAvoidingView = evita que el teclado tape los campos
// Platform = nos dice si estamos en iPhone o Android
// ScrollView = contenedor con scroll
// Text = texto
// TextInput = campo donde se escribe
// TouchableOpacity = elemento que se puede presionar
// View = contenedor (como un div)
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Boton = botón morado reutilizable
// Cabecera = parte de arriba de color con título
// comun = estilos que se repiten (campos, etiquetas)
// (los tres están en src/components/ui.tsx)
import { Boton, Cabecera, comun } from '@/components/ui';
// C = objeto con los colores de la app (src/constants/colores.ts)
import { C } from '@/constants/colores';

// Lista con los campos de texto del formulario.
// Los dibujamos con un .map() más abajo, así no repetimos el mismo código 4 veces.
const CAMPOS = [
  // clave = nombre interno del campo, etiqueta = título que se ve, placeholder = ejemplo en gris
  { clave: 'nombre', etiqueta: 'Nombre completo', placeholder: 'Tu nombre completo' },
  { clave: 'matricula', etiqueta: 'Matrícula', placeholder: 'Ej. 20240312' },
  { clave: 'carrera', etiqueta: 'Carrera', placeholder: 'Tu carrera' },
  { clave: 'correo', etiqueta: 'Correo institucional', placeholder: 'tu.correo@uni.edu.mx' },
  // "as const" le dice a TypeScript que esta lista no cambia
] as const;

// "export default" = esta es la pantalla que Expo Router va a mostrar
export default function Registro() {
  // Guardamos el router para poder regresar al login
  const router = useRouter();
  // Objeto que guarda lo escrito en los 4 campos. Ejemplo: { nombre: 'Ana', matricula: '123' }
  // Record<string, string> = un objeto donde cada clave es texto y cada valor es texto
  const [datos, setDatos] = useState<Record<string, string>>({});
  // Lo que se escribe en la contraseña (empieza vacío)
  const [password, setPassword] = useState('');
  // Mensaje de error (empieza vacío = no se ve)
  const [error, setError] = useState('');

  // Esta función se ejecuta cuando se presiona "Registrarme"
  function registrar() {
    // Si algún campo está vacío (some = "alguno cumple") o la contraseña tiene menos de 8 caracteres...
    if (CAMPOS.some(c => !datos[c.clave]?.trim()) || password.length < 8) {
      // ...mostramos el error
      setError('Completa todos los campos (contraseña de mínimo 8 caracteres)');
      // ...y salimos para no registrar nada
      return;
    }
    // Aquí después se manda al backend
    // Por ahora solo borramos el error y mostramos un aviso;
    // al presionar "Aceptar" regresamos al login con router.back()
    setError('');
    Alert.alert('Cuenta creada', 'Tus datos se registraron (de prueba).', [
      { text: 'Aceptar', onPress: () => router.back() },
    ]);
  }

  // Lo que se ve en pantalla (JSX)
  return (
    // Contenedor que sube el contenido cuando aparece el teclado
    <KeyboardAvoidingView
      // Ocupa toda la pantalla, con fondo crema
      style={{ flex: 1, backgroundColor: C.bg }}
      // En iPhone usa 'padding', en Android no hace falta
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Permite hacer scroll; "handled" deja presionar botones sin cerrar el teclado antes */}
      <ScrollView keyboardShouldPersistTaps="handled">

        {/* ---------- PARTE DE ARRIBA (morada, con el título) ---------- */}
        <Cabecera>
          {/* Texto presionable para regresar al login; router.back() vuelve a la pantalla anterior */}
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
            {/* Texto morado claro */}
            <Text style={{ color: '#DDD6FE', fontSize: 14 }}>‹ Inicio</Text>
          </TouchableOpacity>
          {/* Título grande en blanco */}
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#fff' }}>Crear cuenta</Text>
          {/* Frase debajo del título */}
          <Text style={{ fontSize: 13, color: '#DDD6FE', marginTop: 4 }}>Ingresa tus datos institucionales</Text>
        </Cabecera>

        {/* ---------- FORMULARIO ---------- */}
        <View style={{ padding: 24 }}>
          {/* Recorremos la lista CAMPOS y dibujamos un bloque (título + campo) por cada uno */}
          {CAMPOS.map(c => (
            // "key" es obligatorio en React cuando se dibuja una lista; debe ser único
            <View key={c.clave} style={{ marginBottom: 16 }}>
              {/* Título del campo (por ejemplo "Matrícula") */}
              <Text style={comun.etiqueta}>{c.etiqueta}</Text>
              {/* Campo donde se escribe */}
              <TextInput
                // Estilo común de los campos de texto
                style={comun.input}
                // Texto gris de ejemplo que sale cuando está vacío
                placeholder={c.placeholder}
                // Color de ese texto gris
                placeholderTextColor={C.textMute}
                // En el correo no se pone mayúscula automática; en los demás cada palabra empieza con mayúscula
                autoCapitalize={c.clave === 'correo' ? 'none' : 'words'}
                // Mostramos lo guardado para este campo; si no hay nada, texto vacío ('')
                value={datos[c.clave] ?? ''}
                // Cuando el usuario escribe, copiamos lo que ya había (...prev)
                // y cambiamos solo este campo [c.clave]: v
                onChangeText={v => setDatos(prev => ({ ...prev, [c.clave]: v }))}
              />
            </View>
          ))}
          {/* La contraseña va aparte porque lleva su propio estado y es campo oculto */}
          <Text style={comun.etiqueta}>Contraseña</Text>
          <TextInput
            // Estilo común de los campos de texto
            style={comun.input}
            // Texto gris de ejemplo
            placeholder="Mínimo 8 caracteres"
            // Color de ese texto gris
            placeholderTextColor={C.textMute}
            // Muestra puntitos en lugar de las letras
            secureTextEntry
            // El valor viene del estado "password"
            value={password}
            // Cada vez que se escribe, actualizamos el estado
            onChangeText={setPassword}
          />
          {/* Contenedor para separar el botón del campo de arriba */}
          <View style={{ marginTop: 24 }}>
            {/* Botón morado; al presionarlo se ejecuta la función registrar */}
            <Boton texto="Registrarme" onPress={registrar} />
          </View>
          {/* Si "error" tiene texto lo mostramos en rojo; si está vacío no se dibuja nada */}
          {error ? <Text style={{ color: C.red, fontSize: 13, textAlign: 'center', marginTop: 14 }}>{error}</Text> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
