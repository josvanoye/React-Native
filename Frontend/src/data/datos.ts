export const ORDEN_ESTADOS = [
  'solicitud',
  'revision',
  'pago',
  'preparacion',
  'listo',
  'entregado',
] as const;

export type EstadoSolicitud = (typeof ORDEN_ESTADOS)[number];

export type DocumentoTipo = {
  id: string;
  nombre: string;
  descripcion: string;
  costo: number;
  dias: number;
  icono: string;
  emoji: string;
};

export type Solicitud = {
  id: string;
  nombreAlumno: string;
  matricula: string;
  carrera: string;
  semestre: string;
  correo: string;
  documento: string;
  copias: number;
  estado: EstadoSolicitud;
  fecha: string;
  observaciones: string;
  monto?: number;
};

export type Aviso = {
  id: string;
  titulo: string;
  texto: string;
  hora: string;
  leido: boolean;
  solicitudId?: string;
};

export const ALUMNO = {
  nombre: 'Sofía Ramírez Acuña',
  matricula: '20240312',
  carrera: 'Ingeniería en Tecnologías de la Información',
  semestre: '5to Cuatrimestre',
  correo: '20240312@upv.edu.mx',
  telefono: '+52 (834) 123 4567',
};

export const ETIQUETAS_ESTADO: Record<EstadoSolicitud, string> = {
  solicitud: 'Solicitado',
  revision: 'En revisión',
  pago: 'Pendiente de pago',
  preparacion: 'En preparación',
  listo: 'Listo para entrega',
  entregado: 'Entregado',
};

export const DOCUMENTOS: DocumentoTipo[] = [
  {
    id: '1',
    nombre: 'Constancia de Estudios',
    descripcion: 'Acredita tu condición de estudiante activo y avance curricular.',
    costo: 50,
    dias: 2,
    icono: '📄',
    emoji: '📄',
  },
  {
    id: '2',
    nombre: 'Historial Académico',
    descripcion: 'Kárdex oficial con materias cursadas, créditos y promedio.',
    costo: 80,
    dias: 3,
    icono: '📊',
    emoji: '📊',
  },
  {
    id: '3',
    nombre: 'Credencial Escolar',
    descripcion: 'Reposición de credencial física institucional con código QR.',
    costo: 120,
    dias: 5,
    icono: '🪪',
    emoji: '🪪',
  },
  {
    id: '4',
    nombre: 'Carta de Buena Conducta',
    descripcion: 'Certifica historial disciplinario limpio durante tus estudios.',
    costo: 40,
    dias: 2,
    icono: '📜',
    emoji: '📜',
  },
  {
    id: '5',
    nombre: 'Certificado Parcial',
    descripcion: 'Documento legal para trámites de equivalencia o traslado.',
    costo: 250,
    dias: 10,
    icono: '🎓',
    emoji: '🎓',
  },
];

export const SOLICITUDES_INICIALES: Solicitud[] = [
  {
    id: 'REQ-2026-001',
    nombreAlumno: 'Sofía Ramírez Acuña',
    matricula: '20240312',
    carrera: 'Ing. en Tecnologías de la Información',
    semestre: '5to',
    correo: '20240312@upv.edu.mx',
    documento: 'Constancia de Estudios',
    copias: 1,
    estado: 'preparacion',
    fecha: '26/10/2026',
    observaciones: 'En firma de dirección',
    monto: 50,
  },
];

export const AVISOS_INICIALES: Aviso[] = [
  {
    id: 'n1',
    titulo: 'En preparación',
    texto: 'Tu solicitud REQ-2026-001 de Constancia de Estudios está en preparación.',
    hora: 'Hoy 10:30',
    leido: false,
    solicitudId: 'REQ-2026-001',
  },
];

export const USUARIOS_PRUEBA = {
  alumno: { cuenta: '20240312', password: 'Alumno123' },
  admin: { cuenta: 'ana.gonzalez@uni.edu.mx', password: 'Admin123' },
};
