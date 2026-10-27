import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

export type AuthUser = {
  id: number;
  nombre: string;
  matricula: string | null;
  correo: string;
  rol: "alumno" | "admin";
};

export type AuthSession = {
  token: string;
  usuario: AuthUser;
};

function getDefaultApiUrl(): string {
  if (Platform.OS === "web") {
    return "http://localhost:3000";
  }

  if (!Device.isDevice) {
    return Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://localhost:3000";
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostUrl = new URL(`http://${hostUri}`);
    hostUrl.port = "3000";
    hostUrl.pathname = "";
    hostUrl.search = "";
    hostUrl.hash = "";
    return hostUrl.origin;
  }

  return "http://localhost:3000";
}

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const API_URL = (configuredApiUrl || getDefaultApiUrl()).replace(/\/$/, "");

async function post<T>(path: string, body: Record<string, string | number>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(`No se pudo conectar con el servidor (${API_URL}).`);
  }

  const result = (await response.json()) as { mensaje?: string } & Partial<T>;
  if (!response.ok) {
    throw new Error(result.mensaje ?? "Ocurrió un error al comunicarse con el servidor.");
  }

  return result as T;
}

export function iniciarSesion(cuenta: string, password: string) {
  return post<AuthSession>("login", { cuenta, password });
}

export function registrarAlumno(datos: {
  nombre: string;
  matricula: string;
  carrera: string;
  cuatrimestre: number;
  correo: string;
  password: string;
}) {
  return post<{ usuario: AuthUser }>("register", datos);
}
