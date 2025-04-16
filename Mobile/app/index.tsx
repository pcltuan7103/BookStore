import { useAuthStore } from "@/store/authStore";
import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
    const { user, token, checkAuth, logout } = useAuthStore();

    console.log(user, token)

    useEffect(() => {
        checkAuth();
    }, [])

    return (
        <View
            style={styles.container}
        >
            <Text style={styles.title}>{user?.username}</Text>
            <Text style={styles.title}>{token}</Text>
            <Link href="/auth/signup">Sign Up Page</Link>
            <TouchableOpacity onPress={logout}>
                <Text>Logout</Text>
            </TouchableOpacity>
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
