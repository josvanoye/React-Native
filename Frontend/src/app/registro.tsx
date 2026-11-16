// Pantalla de crear cuenta: al llamarse registro.tsx crea la ruta "/registro"
// Se llega desde el login con router.push('/registro')

// useRouter sirve para cambiar de pantalla o regresar a la anterior
import { useRouter } from "expo-router";
// useState sirve para guardar valores que cambian (lo que escribe el usuario, el error)
import { useState } from "react";
// Componentes básicos de React Native
import {
  // Alert = ventanita de aviso
  Alert,
  // KeyboardAvoidingView = evita que el teclado tape los campos
  KeyboardAvoidingView,
  // Platform = nos dice si estamos en iPhone o Android
  Platform,
  // ScrollView = contenedor con scroll
  ScrollView,
  // Text = para mostrar texto
  Text,
  // TextInput = campo donde se escribe
  TextInput,
  // TouchableOpacity = elemento que se puede presionar
  TouchableOpacity,
  // View = contenedor (como un div)
  View,
} from "react-native";

// Boton = botón morado reutilizable, Cabecera = parte de arriba de color, comun = estilos que se repiten
import { Boton, Cabecera, comun } from "@/components/ui";
// C = objeto con los colores de la app
import { C } from "@/constants/colores";
// Función que manda los datos del alumno al servidor para crear la cuenta
import { registrarAlumno } from "@/services/auth-api";

// Campos de texto del formulario; se dibujan con .map() para no repetir el mismo código
const CAMPOS = [
  {
    // clave = nombre interno del campo (se usa como llave en el objeto "datos")
    clave: "nombre",
    // etiqueta = título que se ve arriba del campo
    etiqueta: "Nombre completo",
    // placeholder = texto gris de ejemplo que sale cuando el campo está vacío
    placeholder: "Tu nombre completo",
  },
  // Campo de la matrícula
  { clave: "matricula", etiqueta: "Matrícula", placeholder: "Ej. 2024031" },
  // Campo de la carrera
  { clave: "carrera", etiqueta: "Carrera", placeholder: "Tu carrera" },
  // Campo del cuatrimestre (se valida que sea un número del 1 al 15)
  { clave: "cuatrimestre", etiqueta: "Cuatrimestre", placeholder: "Del 1 al 15" },
  {
    // Campo del correo institucional
    clave: "correo",
    etiqueta: "Correo institucional",
    placeholder: "tu.correo@upv.edu.mx",
  },
  // "as const" le dice a TypeScript que esta lista no cambia
] as const;

// "export default" = esta es la pantalla que Expo Router va a mostrar
export default function Registro() {
  // Guardamos el router para poder regresar al login
  const router = useRouter();
  // Guarda lo que se escribe en cada campo, usando la clave de CAMPOS como llave
  // Record<string, string> = un objeto donde cada clave es texto y cada valor es texto
  const [datos, setDatos] = useState<Record<string, string>>({});
  // Lo que se escribe en la contraseña (empieza vacío)
  const [password, setPassword] = useState("");
  // Mensaje de error que se muestra abajo del botón (empieza vacío = no se ve)
  const [error, setError] = useState("");
  // Indica si ya se está creando la cuenta (true = esperando respuesta del servidor)
  const [cargando, setCargando] = useState(false);

  // Se ejecuta al presionar "Registrarme"
  async function registrar() {
    // Convertimos el texto del cuatrimestre a número para poder validarlo
    const cuatrimestre = Number(datos.cuatrimestre);
    // Revisa que no falte ningún campo, que el cuatrimestre sea válido y que la contraseña tenga mínimo 8 caracteres
    if (
        // Si algún campo de la lista está vacío (trim quita los espacios)
        CAMPOS.some((c) => !datos[c.clave]?.trim()) ||
        // O si el cuatrimestre no es un número entero
        !Number.isInteger(cuatrimestre) ||
        // O si es menor que 1
        cuatrimestre < 1 ||
        // O si es mayor que 15
        cuatrimestre > 15 ||
        // O si la contraseña tiene menos de 8 caracteres
        password.length < 8
    ) {
      // Mostramos el mensaje de error
      setError("Completa todos los campos (contraseña de mínimo 8 caracteres)");
      // Salimos de la función para no registrar nada
      return;
    }
    // Evita enviar la petición dos veces si ya está cargando
    if (cargando) return;

    // Marcamos que empezó la carga (cambia el texto del botón)
    setCargando(true);
    // try/catch para controlar los errores que pueda mandar el servidor
    try {
      // Mandamos los datos al servidor y esperamos la respuesta (await)
      await registrarAlumno({
        // trim() quita los espacios al inicio y al final
        nombre: datos.nombre.trim(),
        matricula: datos.matricula.trim(),
        carrera: datos.carrera.trim(),
        // El cuatrimestre ya lo convertimos a número arriba
        cuatrimestre,
        // El correo se guarda en minúsculas
        correo: datos.correo.trim().toLowerCase(),
        password,
      });
      // Si todo salió bien, limpiamos cualquier error anterior
      setError("");
      // Mostramos una ventanita avisando que la cuenta se creó
      Alert.alert("Cuenta creada", "Ya puedes iniciar sesión con tu matrícula o correo.", [
        // Al presionar "Aceptar" regresamos al login
        { text: "Aceptar", onPress: () => router.back() },
      ]);
    } catch (err) {
      // Si hubo error, mostramos el mensaje del servidor; si no hay, uno genérico
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
    } finally {
      // finally se ejecuta siempre (haya error o no): quitamos el estado de carga
      setCargando(false);
    }
  }

  // Lo que se ve en pantalla (JSX)
  return (
      // Sube el contenido cuando aparece el teclado (en iPhone usa padding, en Android no hace falta)
      <KeyboardAvoidingView
          // Ocupa toda la pantalla (flex: 1) con fondo crema
          style={{ flex: 1, backgroundColor: C.bg }}
          // Solo en iPhone se usa 'padding' para subir el contenido
          behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* keyboardShouldPersistTaps="handled" deja presionar botones sin cerrar el teclado primero */}
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* ---------- Parte de arriba: título y botón para regresar ---------- */}
          <Cabecera>
            {/* Texto presionable para regresar al login */}
            <TouchableOpacity
                // router.back() vuelve a la pantalla anterior
                onPress={() => router.back()}
                // Espacio de 16 debajo del botón
                style={{ marginBottom: 16 }}
            >
              {/* Texto morado claro del botón de regresar */}
              <Text style={{ color: "#DDD6FE", fontSize: 14 }}>‹ Inicio</Text>
            </TouchableOpacity>
            {/* Título grande en blanco y negritas */}
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#fff" }}>
              Crear cuenta
            </Text>
            {/* Frase pequeña debajo del título */}
            <Text style={{ fontSize: 13, color: "#DDD6FE", marginTop: 4 }}>
              Ingresa tus datos institucionales
            </Text>
          </Cabecera>

          {/* ---------- Formulario ---------- */}
          {/* Contenedor con espacio de 24 por todos lados */}
          <View style={{ padding: 24 }}>
            {/* Recorremos la lista CAMPOS y dibujamos un bloque (título + campo) por cada uno */}
            {CAMPOS.map((c) => (
                // "key" es obligatorio en React al dibujar una lista; debe ser único
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
                      // El correo sin mayúscula automática; los demás con mayúscula en cada palabra
                      autoCapitalize={c.clave === "correo" ? "none" : "words"}
                      // En el cuatrimestre se abre el teclado numérico; en los demás el normal
                      keyboardType={c.clave === "cuatrimestre" ? "number-pad" : "default"}
                      // Mostramos lo guardado para este campo; si no hay nada, texto vacío
                      value={datos[c.clave] ?? ""}
                      // Copia lo que ya había (...prev) y cambia solo este campo
                      onChangeText={(v) => setDatos((prev) => ({ ...prev, [c.clave]: v }))}
                  />
                </View>
            ))}
            {/* La contraseña va aparte porque tiene su propio estado y es campo oculto */}
            {/* Título del campo de contraseña */}
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
              {/* Botón morado; mientras carga cambia el texto; al presionarlo se ejecuta registrar */}
              <Boton texto={cargando ? "Creando cuenta..." : "Registrarme"} onPress={registrar} />
            </View>
            {/* Solo se muestra si hay un mensaje de error; si está vacío no se dibuja nada */}
            {error ? (
                <Text
                    // Texto rojo, pequeño, centrado y con espacio arriba
                    style={{
                      color: C.red,
                      fontSize: 13,
                      textAlign: "center",
                      marginTop: 14,
                    }}
                >
                  {/* Aquí se muestra el mensaje guardado en el estado "error" */}
                  {error}
                </Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}