import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'

import styles from '@/assets/styles/profile.styles';

const LogoutButton = () => {
    const { logout } = useAuthStore();

    const confirmLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: logout,
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View>
            <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
                <Ionicons name='log-out-outline' size={20} color={COLORS.white} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LogoutButton