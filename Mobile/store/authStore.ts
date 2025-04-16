import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (values: IRegister) => {
        set({ isLoading: true });

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    username:values.username
                }),
            })

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Something went wrong");

            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true };
        } catch (error: unknown) {
            set({ isLoading: false });
            return { success: false, error: (error as Error).message };
        }
    },

    login: async (values: ILogin) => {
        set({ isLoading: true });
        
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Something went wrong");

            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: (error as Error).message };
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userJson = await AsyncStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;

            set({ token, user });
        } catch (error) {
            console.log("Auth check error", error);
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        set({ user: null, token: null });
    },
}));