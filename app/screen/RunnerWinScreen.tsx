import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function RunnersWinScreen() {
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#2ECC71' }]}>
            <Text style={styles.title}>DE RUNNERS</Text>
            <Text style={styles.subtitle}>hebben gewonnen!</Text>
            <Text style={styles.coins}>+30 coins voor de runners</Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#A32D2D' }]}
                onPress={() => router.replace('/(tabs)/home')}
            >
                <Text style={styles.buttonText}>Terug naar Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        color: 'white',
        marginBottom: 30,
    },
    coins: {
        fontSize: 14,
        color: 'white',
        marginBottom: 100,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
