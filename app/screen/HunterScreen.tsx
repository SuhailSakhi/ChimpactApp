import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Modal
} from 'react-native';
import MapComponent from '@/components/MapComponent';
import CloseButton from '@/components/CloseButton';
import GameInfo from '@/components/GameInfo';
import { router } from 'expo-router';

export default function RunnerScreen() {
    const [showConfirm, setShowConfirm] = useState(false);

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
                <MapComponent />
            </View>

            <Text style={styles.timer}>Timer: 24:17</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/hunterchallenges')}>
                    <Text style={styles.buttonText}>Challenges</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/huntershop')}>
                    <Text style={styles.buttonText}>Shop</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showConfirm}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Spel verlaten?</Text>
                        <Text style={styles.modalText}>Je kunt niet terug naar het spel.</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.leaveButton} onPress={confirmLeave}>
                                <Text style={styles.buttonText}>Verlaat (ik ben een sukkel)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.stayButton} onPress={cancelLeave}>
                                <Text style={styles.buttonText}>Blijf</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
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
    timer: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 40,
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
});
