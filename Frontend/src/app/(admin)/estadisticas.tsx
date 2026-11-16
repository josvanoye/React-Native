// Importamos los hooks de Expo Router para navegar y recibir parámetros.
import { useLocalSearchParams, useRouter } from 'expo-router';

// Importamos useState para crear variables que pueden cambiar.
import { useState } from 'react';

// Importamos los componentes visuales que utilizaremos de React Native.
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Importamos componentes personalizados de nuestra aplicación.
import { Boton, Encabezado, Fila, Insignia, comun } from '@/components/ui';

// Importamos los colores que utilizaremos en la pantalla.
import { C } from '@/constants/colores';

// Importamos el contexto global para acceder a las solicitudes y cambiar sus estados.
import { useApp } from '@/context/app-context';

// Importamos las etiquetas y el orden de los estados de las solicitudes.
import { ETIQUETAS_ESTADO, ORDEN_ESTADOS } from '@/data/datos';


// Creamos y exportamos el componente principal llamado Detalle.
export default function Detalle() {

  // Obtenemos las funciones de navegación para movernos entre pantallas.
  const router = useRouter();

  // Obtenemos el ID que llega desde la ruta de navegación.
  // El signo ? indica que el ID es opcional y string que es texto.
  const { id } = useLocalSearchParams<{ id?: string }>();

  // Obtenemos la lista de solicitudes y la función para avanzar su estado.
  const { solicitudes, avanzarEstado } = useApp();

  // Buscamos en la lista la solicitud que tenga el mismo ID que recibimos.
  const sol = solicitudes.find(s => s.id === id);

  // Creamos una variable para guardar las observaciones.
  // Si la solicitud tiene observaciones, las mostramos; si no, dejamos vacío.
  const [obs, setObs] = useState(sol?.observaciones ?? '');

  // Creamos una variable para controlar si se muestra el historial.
  // Inicialmente es false, por lo que estará oculto.
  const [historial, setHistorial] = useState(false);


  // Comprobamos si la solicitud no existe.
  if (!sol) {

    // Si no existe, mostramos una pantalla indicando que no fue encontrada.
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>

        // Mostramos el encabezado con el botón para regresar.
        <Encabezado titulo="Detalle" atras={() => router.back()} />

        // Mostramos un mensaje indicando que no se encontró la solicitud.
        <Text style={{ textAlign: 'center', color: C.textMute, marginTop: 60 }}>
          Solicitud no encontrada
        </Text>

      </View>
    );
  }


  // Buscamos la posición del estado actual dentro del arreglo de estados.
  const actual = ORDEN_ESTADOS.indexOf(sol.estado);

  // Obtenemos el siguiente estado que le corresponde a la solicitud.
  const siguiente = ORDEN_ESTADOS[actual + 1];


  // Creamos la función que permite avanzar el estado de la solicitud.
  function avanzar() {

    // Enviamos el ID de la solicitud y las observaciones para actualizarla.
    avanzarEstado(sol!.id, obs);

    // Regresamos a la pantalla anterior después de actualizarla.
    router.back();
  }


  // Comenzamos a construir la interfaz de la pantalla.
  return (

    // View principal que contiene todos los elementos de la pantalla.
    <View style={{ flex: 1, backgroundColor: C.bg }}>

      // Mostramos el encabezado, el botón de regresar y la insignia del estado.
      <Encabezado titulo="Detalle" atras={() => router.back()} derecha={<Insignia estado={sol.estado} />} />

      // Creamos un área desplazable para poder recorrer toda la información.
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>

        // Tarjeta con los datos personales del alumno.
        <View style={comun.tarjeta}>

          // Organizamos horizontalmente el icono y los datos del alumno.
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>

            // Creamos un cuadro para mostrar el icono de graduación.
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>

              // Mostramos el emoji de graduación.
              <Text style={{ fontSize: 18 }}>🎓</Text>

            </View>

            // Contenedor de la información del alumno.
            <View style={{ flex: 1 }}>

              // Mostramos el nombre del alumno.
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>
                {sol.nombreAlumno}
              </Text>

              // Mostramos la carrera que está estudiando.
              <Text style={{ fontSize: 12, color: C.textMute }}>
                {sol.carrera}
              </Text>

            </View>
          </View>

          // Mostramos la matrícula del alumno.
          <Fila etiqueta="Matrícula" valor={sol.matricula} />

          // Mostramos el semestre del alumno.
          <Fila etiqueta="Semestre" valor={sol.semestre} />

          // Mostramos el correo electrónico del alumno.
          <Fila etiqueta="Correo" valor={sol.correo} />

        </View>


        // Tarjeta que contiene los datos del documento solicitado.
        <View style={comun.tarjeta}>

          // Mostramos el nombre del documento solicitado.
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 4 }}>
            {sol.documento}
          </Text>

          // Mostramos el identificador de la solicitud.
          <Fila etiqueta="ID" valor={sol.id} />

          // Mostramos la cantidad de copias solicitadas.
          // String convierte el número de copias en texto.
          <Fila etiqueta="Copias" valor={String(sol.copias)} />

          // Mostramos la fecha en que se realizó la solicitud.
          <Fila etiqueta="Fecha de solicitud" valor={sol.fecha} />

        </View>


        // Creamos un botón para mostrar u ocultar el historial de estados.
        <TouchableOpacity
          style={[comun.tarjeta, { flexDirection: 'row', justifyContent: 'space-between' }]}

          // Cuando se presiona, cambiamos el valor de historial.
          // Si es true pasa a false y si es false pasa a true.
          onPress={() => setHistorial(v => !v)}
        >

          // Mostramos el título de la sección.
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.text }}>
            Historial de estados
          </Text>

          // Mostramos una flecha dependiendo de si el historial está abierto o cerrado.
          <Text style={{ color: C.textMute }}>
            {historial ? '⌄' : '›'}
          </Text>

        </TouchableOpacity>


        // Si historial es true, mostramos el contenido del historial.
        {historial && (

          // Creamos una tarjeta para mostrar los estados anteriores y actuales.
          <View style={comun.tarjeta}>

            // Recorremos los estados desde el primero hasta el estado actual.
            {ORDEN_ESTADOS.slice(0, actual + 1).map(e => (

              // Creamos una fila para cada estado.
              // key identifica de manera única cada elemento.
              <View key={e} style={{ paddingVertical: 6 }}>

                // Mostramos una palomita y el nombre del estado.
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.text }}>
                  ✓  {ETIQUETAS_ESTADO[e]}
                </Text>

                // Mostramos la fecha de la solicitud.
                <Text style={{ fontSize: 12, color: C.textMute, marginLeft: 20 }}>
                  {sol.fecha}
                </Text>

              </View>
            ))}

          </View>
        )}


        // Creamos una tarjeta para agregar o modificar observaciones.
        <View style={comun.tarjeta}>

          // Mostramos el título de la sección.
          <Text style={comun.etiqueta}>Observaciones</Text>

          // Creamos un campo de texto para escribir observaciones.
          <TextInput

            // El contenido del campo corresponde a la variable obs.
            value={obs}

            // Cada vez que el usuario escribe, actualizamos obs.
            onChangeText={setObs}

            // Permitimos escribir varias líneas.
            multiline

            // Establecemos una altura inicial aproximada de tres líneas.
            numberOfLines={3}

            // Mostramos un mensaje cuando el campo está vacío.
            placeholder="Agregar nota interna..."

            // Establecemos el color del texto de ayuda.
            placeholderTextColor={C.textMute}

            // Definimos el tamaño, color, altura y alineación del texto.
            style={{ fontSize: 14, color: C.text, minHeight: 60, textAlignVertical: 'top' }}

          />

        </View>

      </ScrollView>


      // Creamos la sección inferior de la pantalla.
      // Aquí se muestra el progreso y el botón para avanzar la solicitud.
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.bg }}>

        // Creamos una fila horizontal para mostrar la barra de progreso.
        <View style={{ flexDirection: 'row', gap: 4, marginBottom: 8 }}>

          // Recorremos todos los estados para crear los segmentos de progreso.
          {ORDEN_ESTADOS.map((e, i) => (

            // Cada View representa un segmento de la barra.
            <View
              key={e}

              // Todos los segmentos tienen el mismo tamaño.
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,

                // Pintamos los segmentos completados de morado.
                // Los pendientes se muestran con el color del borde.
                backgroundColor: i <= actual ? C.purpleL : C.border
              }}
            />

          ))}

        </View>


        // Mostramos el número del paso actual y la cantidad total de estados.
        <Text style={{ fontSize: 12, fontWeight: '500', color: C.textMute, textAlign: 'center', marginBottom: 12 }}>

          // Mostramos el paso actual, el total de pasos y el nombre del estado.
          Paso {actual + 1} de {ORDEN_ESTADOS.length} · {ETIQUETAS_ESTADO[sol.estado]}

        </Text>


        // Comprobamos si existe un siguiente estado.
        {siguiente ? (

          // Si existe, mostramos un botón para avanzar al siguiente estado.
          <Boton
              texto={"Marcar como: " + ETIQUETAS_ESTADO[siguiente]}

            // Al presionarlo ejecutamos la función avanzar.
            onPress={avanzar}

            // Establecemos el color del botón.
            color={C.admin}
          />

        ) : (

          // Si ya no hay otro estado, mostramos que el proceso terminó.
          <View style={{ backgroundColor: '#DCFCE7', borderRadius: 16, paddingVertical: 14, alignItems: 'center' }}>

            // Mostramos el mensaje de proceso completado.
            <Text style={{ color: C.green, fontWeight: '500', fontSize: 14 }}>
              ✓  Proceso completado
            </Text>

          </View>
        )}

      </View>

    </View>
  );
}
