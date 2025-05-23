import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rewards } from '../data/rewards';

export default function RewardsScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Jouw Beloningen</Text>
                <Text style={styles.subtitle}>Ontgrendel badges door challenges te voltooien!</Text>

                <ScrollView contentContainerStyle={styles.list}>
                    {rewards.map((reward) => (
                        <View key={reward.id} style={styles.card}>
                            <Text style={styles.icon}>{reward.icon}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rewardTitle}>{reward.title}</Text>
                                <Text style={styles.description}>{reward.description}</Text>
                            </View>
                        </View>
                    ))}
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
        paddingTop: 40,
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
    list: {
        paddingBottom: 40,
        gap: 15,
    },
    card: {
        backgroundColor: '#1E1F2B',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        gap: 15,
    },
    icon: {
        fontSize: 30,
    },
    rewardTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    description: {
        color: '#ccc',
        fontSize: 13,
        marginTop: 2,
    },
});
