import { createContext, ReactNode, useContext, useState } from "react";

import { AuthSession, AuthUser } from "@/services/auth-api";

type AuthContextType = {
  sesion: AuthSession | null;
  usuario: AuthUser | null;
  guardarSesion: (sesion: AuthSession) => void;
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<AuthSession | null>(null);

  return (
    <AuthContext.Provider
      value={{
        sesion,
        usuario: sesion?.usuario ?? null,
        guardarSesion: setSesion,
        cerrarSesion: () => setSesion(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
