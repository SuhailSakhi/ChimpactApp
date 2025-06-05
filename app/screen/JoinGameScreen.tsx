// app/screen/JoinGameScreen.tsx

import React, { useState, useEffect, useCallback } from "react";
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
    Image,
    ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";

// Enkel de drie toegestane spellen met bijbehorende afbeelding
const gameOptions = [
    {
        label: "Tag",
        value: "tag",
        image: require("../../assets/images/tag.png"),
    },
    {
        label: "HideOut",
        value: "hideout",
        image: require("../../assets/images/hideout.png"),
    },
    {
        label: "Capture the Flag",
        value: "capture_flag",
        image: require("../../assets/images/capture_flag.png"),
    },
];

type Lobby = {
    id: string;
    code: string;
    players: string[];
    game_type: string;
};

const JoinGameScreen = () => {
    const router = useRouter();
    const { playerId, playerName } = useLocalSearchParams<{
        playerId?: string;
        playerName?: string;
    }>();

    // Camera-permissies & scan-status
    const [permission, requestPermission] = useCameraPermissions();
    const [qrVisible, setQrVisible] = useState(false);
    const [scanned, setScanned] = useState(false);

    // Handmatige lobbycode-invoer
    const [codeModalVisible, setCodeModalVisible] = useState(false);
    const [manualCode, setManualCode] = useState("");

    // Bevestigde lobby (code & id voor update)
    const [resolvedCode, setResolvedCode] = useState("");
    const [resolvedId, setResolvedId] = useState<string | null>(null);

    // Modal voor gebruikersnaam → toevoegen aan lobbies.players
    const [usernameModalVisible, setUsernameModalVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    // Lijst van publieke lobbies
    const [publicLobbies, setPublicLobbies] = useState<Lobby[]>([]);
    const [lobbiesLoading, setLobbiesLoading] = useState<boolean>(true);

    // Haal camera-permissie op
    useEffect(() => {
        if (!permission) requestPermission();
    }, [permission, requestPermission]);

    // 1) QR-code is gescand
    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        validateCode(data.trim());
    };

    // 2) Handmatige code bevestigen
    const handleJoinWithCode = () => {
        validateCode(manualCode.trim());
    };

    // 3) Controleren of lobby met deze code bestaat
    const validateCode = async (code: string) => {
        if (!/^\d{5}$/.test(code)) {
            Alert.alert("Ongeldige code", "Voer een geldige 5-cijferige lobbycode in.");
            setQrVisible(false);
            setScanned(false);
            return;
        }
        setLoading(true);

        // Ophalen van lobby-id én huidige spelers
        const { data, error } = await supabase
            .from("lobbies")
            .select("id, players")
            .eq("code", code)
            .single();

        setLoading(false);
        if (error || !data) {
            Alert.alert("Lobby niet gevonden", "Er bestaat geen lobby met deze code.");
            setQrVisible(false);
            setScanned(false);
            return;
        }

        setResolvedCode(code);
        setResolvedId(data.id);
        setQrVisible(false);
        setScanned(false);
        setCodeModalVisible(false);

        // Als er al een profielnaam is doorgegeven, voeg direct toe en navigeer
        if (playerName) {
            const existingPlayers: string[] = data.players || [];
            if (!existingPlayers.includes(playerName)) {
                const updatedPlayers = [...existingPlayers, playerName];
                await supabase
                    .from("lobbies")
                    .update({ players: updatedPlayers })
                    .eq("id", data.id);
            }
            router.push({
                pathname: "/screen/LobbyScreen",
                params: {
                    code: code,
                    isHost: "false",
                    username: playerName,
                },
            });
            return;
        }

        // Anders: vraag om gebruikersnaam via modal
        setUsernameModalVisible(true);
    };

    // 4) Gebruikersnaam invullen en toevoegen aan lobby
    const handleSubmitUsername = async () => {
        const trimmedName = username.trim();
        if (!trimmedName) {
            Alert.alert("Fout", "Vul een gebruikersnaam in.");
            return;
        }
        if (!resolvedId) {
            Alert.alert("Fout", "Er is geen geldige lobby geselecteerd.");
            return;
        }

        setLoading(true);
        // Haal bestaande spelerslijst op
        const { data: lobbyData, error: fetchError } = await supabase
            .from("lobbies")
            .select("players")
            .eq("id", resolvedId)
            .single();

        if (fetchError || !lobbyData) {
            setLoading(false);
            Alert.alert(
                "Fout",
                "Kon lobby-gegevens niet ophalen:\n" + (fetchError?.message || "")
            );
            return;
        }

        // Voeg toe aan array
        const existingPlayers: string[] = lobbyData.players || [];
        const updatedPlayers = [...existingPlayers, trimmedName];

        const { error: updateError } = await supabase
            .from("lobbies")
            .update({ players: updatedPlayers })
            .eq("id", resolvedId);

        setLoading(false);
        if (updateError) {
            Alert.alert("Fout bij toevoegen speler", updateError.message);
            return;
        }

        // Navigeer naar LobbyScreen
        setUsernameModalVisible(false);
        router.push({
            pathname: "/screen/LobbyScreen",
            params: {
                code: resolvedCode,
                isHost: "false",
                username: trimmedName,
            },
        });
    };

    // --- Ophalen van publieke lobbies uit database, verwijderen lobbies met 0 spelers, en sorteren ---
    const fetchPublicLobbies = useCallback(async () => {
        setLobbiesLoading(true);
        // Haal alle publieke lobby's op
        const { data, error } = await supabase
            .from("lobbies")
            .select("id, code, players, game_type")
            .eq("is_private", false);

        if (!error && data) {
            const validLobbies: Lobby[] = [];
            // Loop door elke opgehaalde lobby
            for (const lobby of data as Lobby[]) {
                // Als geen spelers meer in lobby → verwijder uit database
                if (!lobby.players || lobby.players.length === 0) {
                    await supabase.from("lobbies").delete().eq("id", lobby.id);
                } else {
                    validLobbies.push(lobby);
                }
            }
            // Sorteer valide lobby's op aantal spelers (desc)
            const sorted = validLobbies.sort(
                (a, b) => b.players.length - a.players.length
            );

            setPublicLobbies(sorted);
        }
        setLobbiesLoading(false);
    }, []);

    useEffect(() => {
        fetchPublicLobbies();
    }, [fetchPublicLobbies]);

    // --- Druk op publieke lobby: start join-flow met code ---
    const handlePublicLobbyPress = async (lobby: Lobby) => {
        setResolvedCode(lobby.code);
        setResolvedId(lobby.id);

        // Als er al een profielnaam is doorgegeven, voeg direct toe en navigeer
        if (playerName) {
            const existingPlayers: string[] = lobby.players || [];
            if (!existingPlayers.includes(playerName)) {
                const updatedPlayers = [...existingPlayers, playerName];
                await supabase
                    .from("lobbies")
                    .update({ players: updatedPlayers })
                    .eq("id", lobby.id);
            }
            router.push({
                pathname: "/screen/LobbyScreen",
                params: {
                    code: lobby.code,
                    isHost: "false",
                    username: playerName,
                },
            });
            return;
        }

        // Anders: houd code/id bij en vraag om gebruikersnaam
        setUsernameModalVisible(true);
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
            {/* Toegevoegd: wegknop, absoluut gepositioneerd zodat de rest niet verschuift */}
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.closeButtonAbsolute}
            >
                <Image
                    source={require("../../assets/images/arrow-back.png")}
                    style={styles.closeIcon}
                />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* -------------------------------------------------------------
                    Titel / Label: “Spel zoeken”
                ------------------------------------------------------------- */}
                <Text style={styles.title}>Spel zoeken</Text>

                {/* -------------------------------------------------------------
                    QR & Code knoppen
                ------------------------------------------------------------- */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.topButton}
                        onPress={() => setQrVisible(true)}
                    >
                        <Text style={styles.topButtonText}>Scan QR-code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.topButton}
                        onPress={() => {
                            setManualCode("");
                            setCodeModalVisible(true);
                        }}
                    >
                        <Text style={styles.topButtonText}>Code invoeren</Text>
                    </TouchableOpacity>
                </View>

                {/* -------------------------------------------------------------
                    Label voor publieke lobby's
                ------------------------------------------------------------- */}
                <View style={styles.publicHeaderRow}>
                    <Text style={styles.sectionLabel}>Publieke lobby's</Text>
                    <TouchableOpacity onPress={fetchPublicLobbies} style={styles.refreshBtn}>
                        <Text style={styles.refreshText}>Ververs</Text>
                    </TouchableOpacity>
                </View>

                {/* -------------------------------------------------------------
                    Lijst met publieke lobby's
                ------------------------------------------------------------- */}
                {lobbiesLoading ? (
                    <ActivityIndicator size="large" color="#8EFFA0" />
                ) : (
                    <ScrollView
                        style={styles.lobbyList}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {publicLobbies.map((lobby) => {
                            const { id, code, players, game_type } = lobby;
                            const option = gameOptions.find((o) => o.value === game_type);
                            const imgSource = option?.image;
                            const label = option?.label || game_type;

                            return (
                                <TouchableOpacity
                                    key={id}
                                    style={styles.lobbyCard}
                                    onPress={() => handlePublicLobbyPress(lobby)}
                                >
                                    {imgSource ? (
                                        <Image source={imgSource} style={styles.lobbyImage} />
                                    ) : (
                                        <View style={[styles.lobbyImage, styles.placeholderImage]}>
                                            <Text style={styles.placeholderText}>{label}</Text>
                                        </View>
                                    )}
                                    <Text style={styles.lobbyLabel}>{label}</Text>
                                    <View style={styles.playerCountRow}>
                                        <Text style={styles.playerCountText}>
                                            {players.length}
                                        </Text>
                                        <Text style={styles.playerCountIcon}>👤</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}
            </ScrollView>

            {/* -------------------------------------------------------------
                QR Scanner Modal
            ------------------------------------------------------------- */}
            <Modal visible={qrVisible} animationType="slide">
                <View style={styles.container}>
                    <CameraView
                        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <TouchableOpacity
                        style={[

                            styles.topButton,

                            {

                                position: "absolute",

                                bottom: 60,

                                alignSelf: "center",

                                flex: 0,

                                width: "60%",

                            },

                        ]}
                        onPress={() => {
                            setQrVisible(false);
                            setScanned(false);
                        }}
                    >
                        <Text style={styles.topButtonText}>Annuleren</Text>
                    </TouchableOpacity>
                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}
                </View>
            </Modal>

            {/* -------------------------------------------------------------
                Handmatige code Modal
            ------------------------------------------------------------- */}
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
                        {loading && (
                            <ActivityIndicator
                                size="large"
                                color="#8EFFA0"
                                style={{ marginTop: 10 }}
                            />
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* -------------------------------------------------------------
                Gebruikersnaam Modal (alleen als geen profiel)
            ------------------------------------------------------------- */}
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
                            <ActivityIndicator
                                size="large"
                                color="#8EFFA0"
                                style={{ marginTop: 10 }}
                            />
                        ) : (
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, { flex: 1, marginRight: 8 }]}
                                    onPress={handleSubmitUsername}
                                >
                                    <Text style={styles.modalButtonText}>OK</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.modalButton,
                                        { backgroundColor: "#FF6B6B", flex: 1 },
                                    ]}
                                    onPress={() => setUsernameModalVisible(false)}
                                >
                                    <Text style={styles.modalButtonText}>Annuleren</Text>
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
        paddingTop: 30, // schuift alles iets naar beneden
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 25, // extra ruimte onder de titel
        alignSelf: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 35, // extra ruimte tussen knoppen en publieke lobby's
    },
    topButton: {
        flex: 1,
        backgroundColor: "#8EFFA0",
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: "center",
    },
    topButtonText: {
        color: "#11121A",
        fontSize: 16,
        fontWeight: "bold",
    },
    publicHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20, // extra ruimte onder dit label
        paddingHorizontal: 5,
    },
    sectionLabel: {
        color: "#AAAAAA",
        fontSize: 14,
        fontWeight: "500",
    },
    refreshBtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "#8EFFA0",
        borderRadius: 6,
    },
    refreshText: {
        color: "#11121A",
        fontSize: 12,
        fontWeight: "bold",
    },
    lobbyList: {
        height: 200,
        marginTop: 10, // kleine ruimte tussen header en lijst
    },
    lobbyCard: {
        width: 120,
        marginRight: 15,
        alignItems: "center",
    },
    lobbyImage: {
        width: 120,
        height: 80,
        borderRadius: 8,
        backgroundColor: "#2A2B35",
    },
    placeholderImage: {
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        color: "#888",
        fontSize: 12,
    },
    lobbyLabel: {
        color: "#FFFFFF",
        fontSize: 14,
        marginTop: 6,
        textAlign: "center",
    },
    playerCountRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    playerCountText: {
        color: "#FFFFFF",
        fontSize: 12,
        marginRight: 4,
    },
    playerCountIcon: {
        color: "#8EFFA0",
        fontSize: 12,
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
        alignItems: "center",
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
    // Toegevoegde styles voor de close-knop
    closeButtonAbsolute: {
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 10,
        padding: 8,
    },
    closeIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
});
