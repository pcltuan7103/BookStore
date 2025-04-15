import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
    return (
        <View
            style={styles.container}
        >
            <Text style={styles.title}>123.</Text>
            <Link href="/auth/signup">Sign Up Page</Link>
            <Link href="/auth">Login Page</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    title : {
        fontSize: 20,
        fontWeight: "bold",
        color: "red"
    }
});
