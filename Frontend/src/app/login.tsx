import { StyleSheet, Text, View } from "react-native";

type Props = {
    title: string;
};

export default function PlaceholderScreen({ title }: Props) {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        color: "#999999",
    },
});
