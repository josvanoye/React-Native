export type RequestStatus = 'solicitud' | 'preparacion' | 'listo' | 'entregado'

export interface AppRequest {
  id: string
  studentName: string
  studentId: string
  career: string
  semester: string
  email: string
  documentType: string
  copies: number
  status: RequestStatus
  createdAt: string
  observations: string
}

export interface DocType {
  id: string
  name: string
  description: string
  cost: number
  days: number
  icon: string // nombre de ícono de Feather
}

export interface AppNotification {
  id: string
  title: string
  body: string
  time: string
  read: boolean
  requestId?: string
}

export interface UserProfile {
  name: string
  studentId: string
  career: string
  semester: string
  email: string
  phone: string
}

export const DOC_TYPES: DocType[] = [
  { id: 'historial', name: 'Historial académico', description: 'Registro oficial de materias y calificaciones de tu trayectoria escolar.', cost: 100, days: 5, icon: 'list' },
  { id: 'kardex', name: 'Kardex', description: 'Resumen oficial de calificaciones por materia y período académico.', cost: 180, days: 3, icon: 'bar-chart-2' },
  { id: 'constancia', name: 'Constancia de estudios', description: 'Documento que acredita tu condición de estudiante activo.', cost: 120, days: 2, icon: 'check-circle' },
  { id: 'certificado', name: 'Certificado de estudios', description: 'Documento oficial que acredita los estudios cursados y concluidos.', cost: 450, days: 5, icon: 'shield' },
  { id: 'credencial', name: 'Credencial', description: 'Identificación institucional vigente para estudiantes.', cost: 180, days: 3, icon: 'file' },
]

export const DOC_ACCENTS: Record<string, { bg: string; color: string }> = {
  historial: { bg: '#F3E8FF', color: '#7C3AED' },
  kardex: { bg: '#CCFBF1', color: '#0D9488' },
  constancia: { bg: '#DCFCE7', color: '#16A34A' },
  certificado: { bg: '#FFEDD5', color: '#F97316' },
  credencial: { bg: '#FEF9C3', color: '#CA8A04' },
}

const alumna = {
  studentName: 'Sofía Ramírez Torres', studentId: '2530005',
  career: 'Ing. en Sistemas Computacionales', semester: '6°', email: '2530005@upv.edu.mx',
}

export const SAMPLE_REQUESTS: AppRequest[] = [
  { id: 'REQ-2024-001', ...alumna, documentType: 'Kardex', copies: 1, status: 'preparacion', createdAt: '08/09/2024', observations: '' },
  { id: 'REQ-2024-002', studentName: 'Marco Antonio Vega', studentId: '2430128', career: 'Administración de Empresas', semester: '4°', email: '2430128@upv.edu.mx', documentType: 'Constancia de estudios', copies: 2, status: 'solicitud', createdAt: '09/09/2024', observations: '' },
  { id: 'REQ-2024-003', studentName: 'Valentina Cruz Morales', studentId: '2230841', career: 'Contaduría Pública', semester: '8°', email: '2230841@upv.edu.mx', documentType: 'Historial académico', copies: 1, status: 'solicitud', createdAt: '10/09/2024', observations: '' },
  { id: 'REQ-2024-004', studentName: 'Luis Hernández Pérez', studentId: '2130654', career: 'Ing. Industrial', semester: '9°', email: '2130654@upv.edu.mx', documentType: 'Certificado de estudios', copies: 1, status: 'listo', createdAt: '07/09/2024', observations: '' },
  { id: 'REQ-2024-005', ...alumna, documentType: 'Constancia de estudios', copies: 1, status: 'entregado', createdAt: '28/08/2024', observations: '' },
  { id: 'REQ-2024-006', ...alumna, documentType: 'Historial académico', copies: 1, status: 'solicitud', createdAt: '12/09/2024', observations: '' },
  { id: 'REQ-2024-007', ...alumna, documentType: 'Certificado de estudios', copies: 1, status: 'listo', createdAt: '11/09/2024', observations: '' },
  { id: 'REQ-2024-008', ...alumna, documentType: 'Credencial', copies: 1, status: 'preparacion', createdAt: '10/09/2024', observations: '' },
]

export const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', title: 'Solicitud recibida', body: 'Tu solicitud de Kardex fue recibida y está en preparación.', time: 'Hace 2 horas', read: false, requestId: 'REQ-2024-001' },
  { id: 'n2', title: 'Documento listo', body: 'Tu Certificado de estudios está listo. Pasa por ventanilla 3.', time: 'Hace 1 día', read: false, requestId: 'REQ-2024-004' },
  { id: 'n3', title: 'Documento entregado', body: 'Tu Constancia de estudios fue entregada. ¡Que te vaya bien!', time: 'Hace 1 sem', read: true, requestId: 'REQ-2024-005' },
]

export const STUDENT_USER: UserProfile = {
  name: 'Sofía Ramírez Torres',
  studentId: '2530005',
  career: 'Ing. en Sistemas Computacionales',
  semester: '6°',
  email: '2530005@upv.edu.mx',
  phone: '+52 (55) 1234 5678',
}

// Usuarios de prueba
export const STUDENT_TEST_PASSWORD = 'Alumno123'
export const ADMIN_TEST = { email: 'serviciosesc@upv.edu.mx', password: 'UPVescolares' }

export const STUDENT_ID_PATTERN = /^\d{2}30\d{3}$/

export const UNIVERSITY_CAREERS = [
  'Ingeniería en Manufactura Avanzada',
  'Ingeniería en Sistemas Automotrices',
  'Ingeniería en Tecnologías de la Información e Innovación Digital',
  'Ingeniería Mecatrónica',
  'Licenciatura en Administración',
  'Licenciatura en Comercio Internacional y Aduanas (BIS)',
]

export const STATUS_LABELS: Record<RequestStatus, string> = {
  solicitud: 'Solicitud enviada',
  preparacion: 'En preparación',
  listo: 'Listo para recoger',
  entregado: 'Entregado',
}
export const STATUS_TIMELINE: RequestStatus[] = ['solicitud', 'preparacion', 'listo', 'entregado']
