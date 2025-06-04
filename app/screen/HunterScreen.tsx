import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Modal,
} from 'react-native';
import MapComponent from '@/components/MapComponent';
import CloseButton from '@/components/CloseButton';
import GameInfo from '@/components/GameInfo';
import Timer from '../../components/Timer';
import { router, useLocalSearchParams } from 'expo-router';

export default function HunterScreen() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showRunners, setShowRunners] = useState(false);
    const [showFoundModal, setShowFoundModal] = useState(false);
    const { showRunners: param } = useLocalSearchParams();

    useEffect(() => {
        if (param === 'true') {
            setShowRunners(true);

            const timer = setTimeout(() => {
                setShowRunners(false);
            }, 30000);

            return () => clearTimeout(timer);
        }
    }, [param]);

    const handleClosePress = () => {
        setShowConfirm(true);
    };

    const confirmLeave = () => {
        setShowConfirm(false);
        router.replace('/(tabs)/join');
    };

    const cancelLeave = () => {
        setShowConfirm(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <GameInfo />
            <CloseButton onPress={handleClosePress} />

            <Text style={styles.title}>Hunter</Text>

            <View style={styles.mapContainer}>
                <MapComponent showRunners={showRunners} />
            </View>

            {/* ✅ Vervangt de hardcoded timer */}
            <Timer
                duration={1800}
                onEnd={() => {
                    console.log('⏰ Tijd is om!');
                    router.replace('./runnerwin');
                }}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/hunterchallenges')}>
                    <Text style={styles.buttonText}>Challenges</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/huntershop')}>
                    <Text style={styles.buttonText}>Shop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setShowFoundModal(true)}>
                    <Text style={styles.buttonText}>Gevangen Spelers</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showConfirm} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Spel verlaten?</Text>
                        <Text style={styles.modalText}>Je kunt niet terug naar het spel.</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.leaveButton} onPress={confirmLeave}>
                                <Text style={styles.buttonText}>Verlaat 😢</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.stayButton} onPress={cancelLeave}>
                                <Text style={styles.buttonText}>Blijf</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={showFoundModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.foundModal}>
                        <Text style={styles.foundTitle}>Wie heb je gevonden?</Text>
                        {['Suhail', 'Sem', 'Aslihan', 'Joris'].map((name) => (
                            <View key={name} style={styles.foundCard}>
                                <Text style={styles.foundName}>{name}</Text>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={[styles.button, { marginTop: 20 }]}
                            onPress={() => setShowFoundModal(false)}
                        >
                            <Text style={styles.buttonText}>Sluiten</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#11121A',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
    },
    mapContainer: {
        width: 300,
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
    },
    buttonContainer: {
        width: '100%',
        gap: 20,
        position: 'absolute',
        bottom: 50,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#11121A',
        borderRadius: 10,
        padding: 25,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 20,
    },
    leaveButton: {
        backgroundColor: '#A32D2D',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    stayButton: {
        backgroundColor: '#2ECC71',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    foundModal: {
        backgroundColor: '#1C1D26',
        borderRadius: 15,
        padding: 20,
        width: '85%',
        alignItems: 'center',
    },
    foundTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8AF2B1',
        marginBottom: 20,
    },
    foundCard: {
        backgroundColor: '#1A1B22',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    foundName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});
