import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Hola, mundo! 🚀</Text>
      <Text style={styles.subtitulo}>Mi primera app con React Native y Expo ya está funcionando.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e24',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: '#a0a0b0',
    textAlign: 'center',
  },
});