import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (values: IRegister) => {
        set({ isLoading: true });

        try {
            const response = await fetch("https://bookstore-2bkc.onrender.com/api/auth/register", {
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
    }
}));