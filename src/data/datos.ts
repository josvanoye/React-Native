// Usuarios de prueba para entrar a la app mientras no exista el backend.
// Cuando haya backend, esto se reemplaza por una consulta a la base de datos.
export const USUARIOS_PRUEBA = {
  // Usuario tipo alumno: entra con su matrícula y esta contraseña
  alumno: { cuenta: '20240312', password: 'Alumno123' },
  // Usuario tipo administrador: entra con su correo y esta contraseña
  admin: { cuenta: 'ana.gonzalez@uni.edu.mx', password: 'Admin123' },
};
