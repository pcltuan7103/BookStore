import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/store/authStore';

export default function Home() {
const { logout } = useAuthStore();

    return (
        <View>
            <Text>Home tab</Text>

            <Text onPress={logout}>Logout</Text>
        </View>
    )
}