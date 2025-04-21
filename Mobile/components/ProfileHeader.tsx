import React from 'react'
import styles from '@/assets/styles/profile.styles'
import { Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useAuthStore } from '@/store/authStore'
import { formatMemberSince } from '@/lib/utils'

const ProfileHeader = () => {
    const { user } = useAuthStore(); 

    if (!user) return null;

    return (
        <View style={styles.profileHeader}>
            <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />

            <View style={styles.profileInfo}>
                <Text style={styles.username}>{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <Text>Joined {formatMemberSince(String(user?.createdAt))}</Text>
            </View>
        </View>
    )
}

export default ProfileHeader