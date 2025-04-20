import { View, ActivityIndicator } from 'react-native'
import React, { FC } from 'react'
import COLORS from '@/constants/colors'

const Loader: FC<LoaderProps> = ({ size = 'large' }) => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.background
            }}
        >
            <ActivityIndicator size={size} color={COLORS.primary} />
        </View>
    )
}

export default Loader