// Importa los componentes básicos de React Native: StyleSheet para los estilos, Text para mostrar texto y View como contenedor
import { StyleSheet, Text, View } from "react-native";

// Define las propiedades (props) que recibe este componente
type Props = {
    // title es el texto que se va a mostrar en la pantalla
    title: string;
};

// Pantalla temporal (placeholder): sirve para pantallas que todavía no están terminadas
export default function PlaceholderScreen({ title }: Props) {
    return (
        // Contenedor que ocupa toda la pantalla y centra su contenido
        <View style={styles.container}>
            {/* Muestra el título que se le pasó al componente */}
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

// Estilos del componente
const styles = StyleSheet.create({
    // Estilo del contenedor principal
    container: {
        // flex: 1 hace que ocupe todo el espacio disponible de la pantalla
        flex: 1,
        // Fondo blanco
        backgroundColor: "#FFFFFF",
        // Centra el contenido horizontalmente
        alignItems: "center",
        // Centra el contenido verticalmente
        justifyContent: "center",
    },
    // Estilo del texto del título
    title: {
        // Tamaño de letra
        fontSize: 18,
        // Color gris claro para que se note que es una pantalla provisional
        color: "#999999",
    },
});