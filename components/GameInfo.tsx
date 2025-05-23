import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function GameInfo() {
    const insets = useSafeAreaInsets();
    const [visible, setVisible] = useState(false);

    return (
        <>
            <TouchableOpacity style={[styles.infoButton, { top: insets.top + 10 }]} onPress={() => setVisible(true)}>
                <Ionicons name="information-circle-outline" size={26} color="#fff" />
            </TouchableOpacity>

            <Modal visible={visible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Spelregels</Text>
                        <Text style={styles.subtitle}>HideOut</Text>

                        <Text style={styles.section}><Text style={styles.bold}>Rollen</Text>{'\n'}• Hunter{'\n'}• Runner</Text>

                        <Text style={styles.paragraph}>
                            <Text style={styles.bold}>Geen klassiek verstoppertje:</Text>{'\n'}
                            In dit spel neemt de Hunter het op tegen de Runners. De Hunter moet alle Runners opsporen voordat de tijd om is.
                        </Text>

                        <Text style={styles.paragraph}>
                            Beide rollen kunnen challenges voltooien om munten te verdienen. Met deze munten kun je power-ups of hints kopen in de shop om je te helpen tijdens het spel.
                        </Text>

                        <Text style={styles.paragraph}>
                            • De Hunter ziet het wel als er een Runner verwijderd is. Zodra hij iemand vindt, bevestigen beide spelers dat de Runner is gepakt.{'\n'}
                            • De Runner kan de locatie van de Hunter zien en mag binnen een vooraf ingestelde radius van verblijfplek wisselen.
                        </Text>

                        <Text style={styles.paragraph}>
                            <Text style={styles.bold}>Doelen:</Text>{'\n'}
                            • <Text style={styles.bold}>Hunter:</Text> Vind en vang alle Runners binnen de tijd.{'\n'}
                            • <Text style={styles.bold}>Runner:</Text> Blijf uit handen van de Hunter tot de tijd voorbij is.
                        </Text>

                        <TouchableOpacity style={styles.backButton} onPress={() => setVisible(false)}>
                            <Text style={styles.backButtonText}>Terug naar het spel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    infoButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,
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
        padding: 20,
        width: '90%',
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 12,
        textAlign: 'center',
    },
    section: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 10,
    },
    paragraph: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 12,
    },
    bold: {
        fontWeight: 'bold',
        color: '#fff',
    },
    backButton: {
        backgroundColor: '#A32D2D',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
