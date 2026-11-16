// Pantalla de login: al llamarse index.tsx es la primera que se abre (ruta "/")

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Boton, comun } from "@/components/ui";
import { C } from "@/constants/colores";
import { useAuth } from "@/context/auth-context";
import { iniciarSesion as autenticar } from "@/services/auth-api";

export default function Login() {
  const router = useRouter();
  const { guardarSesion } = useAuth();
  // Espacio de las zonas del celular que no se pueden usar (notch, barra de estado)
  const insets = useSafeAreaInsets();
  const [cuenta, setCuenta] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Se ejecuta al presionar "Iniciar sesión"
  async function iniciarSesion() {
    const c = cuenta.trim().toLowerCase();
    if (!c || !password) {
      setError("Completa todos los campos");
      return;
    }
    // Evita enviar la petición dos veces si ya está cargando
    if (cargando) return;

    setCargando(true);
    try {
      const sesion = await autenticar(c, password);
      guardarSesion(sesion);
      setError("");
      // Según el rol, manda al panel de admin o al inicio del alumno
      router.replace(
          sesion.usuario.rol === "admin" ? "/(admin)/panel" : "/(alumno)/inicio",
      );
    } catch (err) {
      setError(
          err instanceof Error ? err.message : "No se pudo iniciar sesión.",
      );
    } finally {
      setCargando(false);
    }
  }

  return (
      // Sube el contenido cuando aparece el teclado (en iPhone usa padding, en Android no hace falta)
      <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: C.purple }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* keyboardShouldPersistTaps deja presionar botones sin cerrar el teclado primero */}
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
          {/* ---------- Parte de arriba: logo y nombre de la app ---------- */}
          <View style={[styles.arriba, { paddingTop: insets.top + 32 }]}>
            <View style={styles.logo}>
              <Text style={{ fontSize: 26 }}>📄</Text>
            </View>
            <Text style={styles.nombre}>PoliDocs</Text>
            <Text style={styles.sub}>Gestión de documentos académicos</Text>
          </View>

          {/* ---------- Parte de abajo: formulario ---------- */}
          <View style={styles.formulario}>
            <Text style={comun.etiqueta}>
              Matrícula, correo o usuario administrativo
            </Text>
            <TextInput
                style={comun.input}
                value={cuenta}
                onChangeText={setCuenta}
                placeholder="Ingresa tu matrícula, correo o usuario"
                placeholderTextColor={C.textMute}
                // Evita que el teclado ponga mayúscula al inicio (importante en correos)
                autoCapitalize="none"
            />
            <Text style={[comun.etiqueta, { marginTop: 16 }]}>Contraseña</Text>
            <TextInput
                style={comun.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor={C.textMute}
                // Muestra puntitos en lugar de las letras
                secureTextEntry
            />
            {/* Todavía no hace nada */}
            <TouchableOpacity
                style={{ alignSelf: "flex-end", marginVertical: 12 }}
            >
              <Text style={{ color: C.purpleL, fontSize: 13, fontWeight: "500" }}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <Boton
                texto={cargando ? "Iniciando sesión..." : "Iniciar sesión"}
                onPress={iniciarSesion}
            />

            {/* Solo se muestra si hay un mensaje de error */}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 18,
                }}
            >
              <Text style={{ color: C.textMute, fontSize: 13 }}>
                ¿No tienes cuenta?{" "}
              </Text>
              {/* push permite regresar a esta pantalla con el botón de atrás */}
              <TouchableOpacity onPress={() => router.push("/registro")}>
                <Text
                    style={{ color: C.purpleL, fontSize: 13, fontWeight: "600" }}
                >
                  Crear cuenta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  arriba: { alignItems: "center", paddingBottom: 28, paddingHorizontal: 32 },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  nombre: { fontSize: 26, fontWeight: "700", color: "#fff" },
  sub: { fontSize: 13, color: "#DDD6FE", marginTop: 4 },
  // Tarjeta que ocupa el resto de la pantalla, con las esquinas de arriba redondeadas
  formulario: {
    flex: 1,
    backgroundColor: C.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 28,
  },
  error: {
    color: C.red,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 14,
  },
});