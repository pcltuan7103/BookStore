import SafeScreen from "@/components/SafeScreen";
import { useAuthStore } from "@/store/authStore";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();

    const { checkAuth, user, token } = useAuthStore();

    useEffect(() => {
        checkAuth()
    }, []);

    useEffect(() => {
        const isAuthScreen = segments[0] === "auth";
        const isSignedIn = user && token;

        if (!isAuthScreen && !isSignedIn) router.replace("/auth");
        else if (isAuthScreen && isSignedIn) router.replace("/tabs");
    }, [user, token, segments]);

    return (
        <SafeAreaProvider>
            <SafeScreen>
                <Stack screenOptions={{ headerShown: false }} >
                    <Stack.Screen name="tabs" />
                    <Stack.Screen name="auth" />
                </Stack>
            </SafeScreen>
            <StatusBar style="dark" />
        </SafeAreaProvider>
    )
}
