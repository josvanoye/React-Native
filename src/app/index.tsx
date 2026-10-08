import { StyleSheet, View } from "react-native";

console.log("Conectado a MySQL");

export default function Index() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

console.log("Bienvenido a mi página");
