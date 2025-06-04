import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function HunterWinScreen() {
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#A32D2D' }]}>
            <Text style={styles.title}>DE HUNTER</Text>
            <Text style={styles.subtitle}>heeft gewonnen!</Text>
            <Text style={styles.coins}>+30 coins voor de hunter</Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#2ECC71' }]}
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
        paddingTop: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        paddingTop: 100,
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
