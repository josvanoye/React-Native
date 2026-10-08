import { createContext, ReactNode, useContext, useState } from 'react';

import {
  ALUMNO,
  AVISOS_INICIALES,
  Aviso,
  DocumentoTipo,
  ETIQUETAS_ESTADO,
  ORDEN_ESTADOS,
  Solicitud,
  SOLICITUDES_INICIALES,
} from '@/data/datos';

type AppContextType = {
  solicitudes: Solicitud[];
  avisos: Aviso[];
  noLeidos: number;
  crearSolicitud: (doc: DocumentoTipo, copias: number) => void;
  avanzarEstado: (id: string, observaciones?: string) => void;
  marcarAvisosLeidos: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

function fechaHoy() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(SOLICITUDES_INICIALES);
  const [avisos, setAvisos] = useState<Aviso[]>(AVISOS_INICIALES);

  const noLeidos = avisos.filter(a => !a.leido).length;

  function crearSolicitud(doc: DocumentoTipo, copias: number) {
    const id = `REQ-2024-${String(solicitudes.length + 1).padStart(3, '0')}`;
    const nueva: Solicitud = {
      id,
      nombreAlumno: ALUMNO.nombre,
      matricula: ALUMNO.matricula,
      carrera: ALUMNO.carrera,
      semestre: ALUMNO.semestre,
      correo: ALUMNO.correo,
      documento: doc.nombre,
      copias,
      estado: 'solicitud',
      fecha: fechaHoy(),
      observaciones: '',
    };
    setSolicitudes(prev => [...prev, nueva]);
    setAvisos(prev => [
      { id: `n${Date.now()}`, titulo: 'Solicitud enviada', texto: `Tu solicitud de ${doc.nombre} fue recibida y está en proceso.`, hora: 'Ahora', leido: false, solicitudId: id },
      ...prev,
    ]);
  }

  function avanzarEstado(id: string, observaciones?: string) {
    const sol = solicitudes.find(s => s.id === id);
    if (!sol) return;
    const siguiente = ORDEN_ESTADOS[ORDEN_ESTADOS.indexOf(sol.estado) + 1];
    if (!siguiente) return;
    setSolicitudes(prev =>
      prev.map(s => (s.id === id ? { ...s, estado: siguiente, observaciones: observaciones ?? s.observaciones } : s)),
    );
    setAvisos(prev => [
      { id: `n${Date.now()}`, titulo: ETIQUETAS_ESTADO[siguiente], texto: `Estado actualizado: ${ETIQUETAS_ESTADO[siguiente]} para ${sol.documento}.`, hora: 'Ahora', leido: false, solicitudId: id },
      ...prev,
    ]);
  }

  function marcarAvisosLeidos() {
    setAvisos(prev => prev.map(a => ({ ...a, leido: true })));
  }

  return (
    <AppContext.Provider value={{ solicitudes, avisos, noLeidos, crearSolicitud, avanzarEstado, marcarAvisosLeidos }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}
