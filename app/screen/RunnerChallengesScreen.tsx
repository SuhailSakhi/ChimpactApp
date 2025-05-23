import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CloseButton from '@/components/CloseButton';
import { runnerChallenges } from '../data/challenges';

export default function RunnerChallengesScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.closeWrapper}>
                <CloseButton onPress={() => router.replace('/runner')} />
            </View>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Runner Challenges</Text>
                    <Text style={styles.subtitle}>Doe challenges om coins te verdienen voor power-ups!</Text>

                    {runnerChallenges.map((item) => (
                        <View key={item.id} style={styles.challengeCard}>
                            <Text style={styles.icon}>{item.icon}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.challengeText}>{item.text}</Text>
                            </View>
                            <Text style={styles.coinText}>+{item.coins} coins</Text>
                        </View>
                    ))}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => router.push('/runner')}>
                            <Text style={styles.buttonText}>Map</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => router.push('/runnershop')}>
                            <Text style={styles.buttonText}>Shop</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#11121A',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingTop: 50,
        paddingBottom: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    challengeCard: {
        backgroundColor: '#1E1F2B',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    challengeText: {
        color: '#fff',
        fontSize: 15,
    },
    coinText: {
        color: '#8EFFA0',
        fontWeight: 'bold',
        fontSize: 14,
    },
    icon: {
        fontSize: 24,
        marginRight: 8,
    },
    buttonContainer: {
        marginTop: 60,
        marginBottom: 40,
        gap: 15,
        alignItems: 'center',
    },

    button: {
        backgroundColor: '#A32D2D',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeWrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingTop: 20,
        paddingRight: 20,
        zIndex: 1000,
    },

});
