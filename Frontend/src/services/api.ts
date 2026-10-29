// Cliente para hablar con el servidor (catálogo, solicitudes, etc.).
// Usa la misma dirección del servidor que el login (auth-api.ts), así funciona
// igual en web, emulador y teléfono sin escribir una IP a mano.
import { API_URL as SERVIDOR } from './auth-api';

const BASE = `${SERVIDOR}/api`;

async function manejarRespuesta<T>(res: Response): Promise<T> {
  const datos: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    // Las rutas de Joseline responden { mensaje }, las del catálogo { error }.
    const cuerpo = datos as { mensaje?: string; error?: string } | null;
    throw new Error(cuerpo?.mensaje ?? cuerpo?.error ?? 'Error del servidor');
  }
  return datos as T;
}

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  try {
    return manejarRespuesta<T>(await fetch(`${BASE}${ruta}`, init));
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(`No se pudo conectar con el servidor (${SERVIDOR}).`);
    }
    throw e;
  }
}

export function get<T>(ruta: string, token?: string): Promise<T> {
  return pedir<T>(ruta, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
}

export function post<T>(ruta: string, cuerpo: unknown, token?: string): Promise<T> {
  return pedir<T>(ruta, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(cuerpo),
  });
}
