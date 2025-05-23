import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    onPress: () => void;
};

export default function CloseButton({ onPress }: Props) {
    const insets = useSafeAreaInsets();

    return (
        <TouchableOpacity
            style={[styles.closeButton, { top: insets.top + 10 }]}
            onPress={onPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="close" size={28} color="#ffffff" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        right: 20,
        zIndex: 1000,
    },
});
