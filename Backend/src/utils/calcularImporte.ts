export function calcularImporte(costo: number, copias: number): number {
  return Math.round(costo * copias * 100) / 100;
}
