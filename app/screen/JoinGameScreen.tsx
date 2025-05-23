import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

const JoinGameScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [qrVisible, setQrVisible] = useState(false);
    const [code, setCode] = useState("");
    const [scanned, setScanned] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, []);

    const handleJoinLobby = () => {
        if (/^\d{5}$/.test(code)) {
            Alert.alert("Code ingevoerd", `Je hebt ${code} ingevoerd`);
            setModalVisible(false);
            setQrVisible(false);
            setScanned(false);
            setCode("");
        } else {
            Alert.alert("Ongeldige code", "Voer een geldige 5-cijferige code in.");
        }
    };

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        if (/^\d{5}$/.test(data)) {
            setCode(data);
            handleJoinLobby();
        } else {
            Alert.alert("Ongeldige QR-code", "De QR-code bevat geen geldige 5-cijferige code.");
            setQrVisible(false);
            setScanned(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Join Game</Text>
            <Text style={styles.subtitle}>Dit is het join scherm</Text>

            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Join private lobby</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setQrVisible(true)}>
                <Text style={styles.buttonText}>Scan QR code</Text>
            </TouchableOpacity>

            {/* Nieuwe knoppen */}
            <TouchableOpacity style={styles.button} onPress={() => router.push("/runner")}>
                <Text style={styles.buttonText}>Start als Runner</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => router.push("/hunter")}>
                <Text style={styles.buttonText}>Start als Hunter</Text>
            </TouchableOpacity>

            {/* Code invoer modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
                        <Text style={styles.modalTitle}>Voer 5-cijferige code in:</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            maxLength={5}
                            value={code}
                            onChangeText={setCode}
                            placeholder="12345"
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={handleJoinLobby}>
                            <Text style={styles.modalButtonText}>Bevestig</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* QR scanner modal */}
            <Modal visible={qrVisible} animationType="slide" transparent={false}>
                <View style={styles.container}>
                    <CameraView
                        barcodeScannerSettings={{
                            barcodeTypes: ['qr'],
                        }}
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <TouchableOpacity
                        style={[styles.button, { position: "absolute", bottom: 60 }]}
                        onPress={() => {
                            setQrVisible(false);
                            setScanned(false);
                        }}
                    >
                        <Text style={styles.buttonText}>Annuleren</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default JoinGameScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#11121A",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#8EFFA0",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#ffffff",
        marginBottom: 40,
    },
    button: {
        backgroundColor: "#8EFFA0",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: "#11121A",
        fontWeight: "bold",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 30,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: "#11121A",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        width: "100%",
        marginBottom: 15,
        fontSize: 16,
    },
    modalButton: {
        backgroundColor: "#8EFFA0",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalButtonText: {
        color: "#11121A",
        fontWeight: "bold",
        fontSize: 16,
    },
});
