// app/screen/JoinGameScreen.tsx

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
    ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

const JoinGameScreen = () => {
    const router = useRouter();

    // Camera-permissies & scan-states
    const [permission, requestPermission] = useCameraPermissions();
    const [qrVisible, setQrVisible] = useState(false);
    const [scanned, setScanned] = useState(false);

    // Handmatige lobby-code invoer
    const [codeModalVisible, setCodeModalVisible] = useState(false);
    const [manualCode, setManualCode] = useState("");

    // De code (5-cijferig) die bevestigd is (via QR of handmatig)
    const [resolvedCode, setResolvedCode] = useState("");

    // Modal voor gebruikersnaam-invoer
    const [usernameModalVisible, setUsernameModalVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, []);

    // Stap 1: QR-code gescand
    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        validateCode(data.trim());
    };

    // Stap 2: Handmatige code bevestigen
    const handleJoinWithCode = () => {
        validateCode(manualCode.trim());
    };

    // Stap 3: Controleer of lobby met deze code bestaat
    const validateCode = async (code: string) => {
        if (!/^\d{5}$/.test(code)) {
            Alert.alert("Ongeldige code", "Voer een geldige 5-cijferige lobbycode in.");
            setQrVisible(false);
            setScanned(false);
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from("lobbies")
            .select("code")
            .eq("code", code)
            .single();
        setLoading(false);

        if (error || !data) {
            Alert.alert("Lobby niet gevonden", "Er bestaat geen lobby met deze code.");
            setQrVisible(false);
            setScanned(false);
            return;
        }

        // Lobby gevonden: toon gebruikersnaam-modal
        setResolvedCode(code);
        setQrVisible(false);
        setScanned(false);
        setCodeModalVisible(false);
        setUsernameModalVisible(true);
    };

    // Stap 4: Gebruikersnaam invoeren en toevoegen aan lobby.players
    const handleSubmitUsername = async () => {
        const trimmedName = username.trim();
        if (!trimmedName) {
            Alert.alert("Fout", "Vul een gebruikersnaam in.");
            return;
        }

        setLoading(true);
        // 4a) Haal bestaande players-array op
        const { data: lobbyData, error: fetchError } = await supabase
            .from("lobbies")
            .select("players")
            .eq("code", resolvedCode)
            .single();

        if (fetchError || !lobbyData) {
            setLoading(false);
            Alert.alert("Fout", "Kon lobby-gegevens niet ophalen.");
            return;
        }

        const existingPlayers: string[] = lobbyData.players || [];
        // 4b) Voeg nieuwe naam toe
        const updatedPlayers = [...existingPlayers, trimmedName];

        // 4c) Update de lobby met de nieuwe array
        const { error: updateError } = await supabase
            .from("lobbies")
            .update({ players: updatedPlayers })
            .eq("code", resolvedCode);

        setLoading(false);
        if (updateError) {
            Alert.alert("Fout bij toevoegen speler", updateError.message);
            return;
        }

        // 4d) Sluit modal en navigeer naar LobbyScreen
        setUsernameModalVisible(false);
        router.push({
            pathname: "/screen/LobbyScreen",
            params: { code: resolvedCode, isHost: "false" },
        });
    };

    if (permission === null) {
        return (
            <View style={[styles.container, { justifyContent: "center" }]}>
                <ActivityIndicator size="large" color="#8EFFA0" />
            </View>
        );
    }
    if (permission?.granted === false) {
        return (
            <View style={[styles.container, { justifyContent: "center" }]}>
                <Text style={styles.permissionText}>Geen toegang tot camera</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Join Game</Text>
            <Text style={styles.subtitle}>Scan QR of voer code in</Text>

            {/* Knop om QR-code te scannen */}
            <TouchableOpacity style={styles.button} onPress={() => setQrVisible(true)}>
                <Text style={styles.buttonText}>Scan QR code</Text>
            </TouchableOpacity>

            {/* Knop om handmatig code in te voeren */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    setManualCode("");
                    setCodeModalVisible(true);
                }}
            >
                <Text style={styles.buttonText}>Join private lobby</Text>
            </TouchableOpacity>

            {/* Knop om als Runner te starten (ongewijzigd) */}
            <TouchableOpacity style={styles.button} onPress={() => router.push("/runner")}>
                <Text style={styles.buttonText}>Start als Runner</Text>
            </TouchableOpacity>

            {/* Knop om als Hunter te starten (ongewijzigd) */}
            <TouchableOpacity style={styles.button} onPress={() => router.push("/hunter")}>
                <Text style={styles.buttonText}>Start als Hunter</Text>
            </TouchableOpacity>

            {/*---------------------------------------------
          QR Scanner Modal
      ---------------------------------------------*/}
            <Modal visible={qrVisible} animationType="slide">
                <View style={styles.container}>
                    <CameraView
                        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
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
                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}
                </View>
            </Modal>

            {/*---------------------------------------------
          Handmatige code Modal
      ---------------------------------------------*/}
            <Modal visible={codeModalVisible} animationType="slide" transparent>
                <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={() => setCodeModalVisible(false)}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Voer 5-cijferige code in:</Text>
                        <TextInput
                            style={styles.modalInput}
                            keyboardType="numeric"
                            maxLength={5}
                            value={manualCode}
                            onChangeText={setManualCode}
                            placeholder="12345"
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={handleJoinWithCode}>
                            <Text style={styles.modalButtonText}>Bevestig</Text>
                        </TouchableOpacity>
                        {loading && <ActivityIndicator size="large" color="#8EFFA0" />}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/*---------------------------------------------
          Gebruikersnaam Modal
      ---------------------------------------------*/}
            <Modal visible={usernameModalVisible} animationType="fade" transparent>
                <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={() => setUsernameModalVisible(false)}
                    style={styles.modalOverlay}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Vul je gebruikersnaam in</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Gebruikersnaam"
                            placeholderTextColor="#999"
                            value={username}
                            onChangeText={setUsername}
                            editable={!loading}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color="#8EFFA0" />
                        ) : (
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.button, { flex: 1, marginRight: 8 }]}
                                    onPress={handleSubmitUsername}
                                >
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: "#FF6B6B", flex: 1 }]}
                                    onPress={() => setUsernameModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Annuleren</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
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
    manualContainer: {
        width: "100%",
        marginBottom: 20,
    },
    manualInput: {
        width: "100%",
        backgroundColor: "#1F202A",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    permissionText: {
        color: "#fff",
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
    modalInput: {
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
        marginTop: 10,
    },
    modalButtonText: {
        color: "#11121A",
        fontWeight: "bold",
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: "row",
        width: "100%",
        marginTop: 10,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
});
