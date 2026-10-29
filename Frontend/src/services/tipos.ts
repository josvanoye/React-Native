// Tipos de lo que responde el servidor para el catálogo y la ficha de pago.

export type Documento = {
  id: number;
  nombre: string;
  descripcion: string;
  // MySQL puede devolver los DECIMAL como texto ("150.00"), por eso se
  // convierte con Number() antes de calcular o mostrar.
  costo: number | string;
  dias_estimados: number;
  formato: string;
  vigencia_dias: number | null;
  icono: string | null;
};

export type Ficha = {
  folio: string;
  referencia: string;
  monto: number | string;
  fecha_limite: string;
};
