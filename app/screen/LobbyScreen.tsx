// app/screen/LobbyScreen.tsx

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    ActivityIndicator,
    Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useRouter, useLocalSearchParams } from "expo-router"; // let op: useLocalSearchParams i.p.v. useSearchParams
import { supabase } from "@/lib/supabase";

// Type voor gebruikers (we gebruiken hier alleen een string-naam)
type User = {
    id: string;
    name: string;
};

const LobbyScreen = () => {
    const router = useRouter();
    const { code: codeParam, isHost: isHostParam } =
        useLocalSearchParams<{
            code: string;
            isHost: string;
        }>(); // gebruik useLocalSearchParams i.p.v. useSearchParams

    // Zet de route-param om naar booleaanse waarde
    const isHost = isHostParam === "true";

    // State voor lobbycode en deelnemers
    const [lobbyCode, setLobbyCode] = useState<string>(codeParam || "");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [settingsVisible, setSettingsVisible] = useState(false);

    // Haal de lobby (en spelers-array) op uit Supabase
    useEffect(() => {
        if (!lobbyCode) {
            Alert.alert("Fout", "Geen lobbycode meegegeven.");
            setLoading(false);
            return;
        }

        const fetchLobby = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("lobbies")
                .select("players")
                .eq("code", lobbyCode)
                .single(); // we verwachten precies één record

            if (error) {
                Alert.alert("Fout bij ophalen lobby", error.message);
                setLoading(false);
                return;
            }

            // data.players is een text[] met gebruikersnamen
            // Mappen naar een User-array met unieke id's (indien gewenst kun je een uuid gebruiken)
            const fetchedPlayers = (data.players || []).map(
                (name: string, idx: number) => ({
                    id: idx.toString(),
                    name,
                })
            );
            setUsers(fetchedPlayers);
            setLoading(false);
        };

        fetchLobby();
    }, [lobbyCode]);

    // Host kan gebruikers “kicken” (alleen UI-gewijs; voor persistente update moet je dit in de DB doen)
    const kickUser = (id: string) => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        // Voor persistente update in Supabase kun je iets als:
        // supabase
        //   .from("lobbies")
        //   .update({ players: users.filter((u) => u.id !== id).map((u) => u.name) })
        //   .eq("code", lobbyCode);
    };

    // Render één deelnemer
    const renderUser = ({ item }: { item: User }) => (
        <View style={styles.userRow}>
            <Text style={styles.userName}>{item.name}</Text>
            {isHost && (
                <TouchableOpacity
                    onPress={() => kickUser(item.id)}
                    style={styles.kickButton}
                >
                    <Text style={styles.kickText}>Kick</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center" }]}>
                <ActivityIndicator size="large" color="#8EFFA0" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Lobby Code + QR-code */}
            <Text style={styles.codeLabel}>Lobby Code:</Text>
            <Text style={styles.lobbyCode}>{lobbyCode}</Text>
            <View style={styles.qrContainer}>
                <QRCode value={lobbyCode} size={160} backgroundColor="#fff" />
            </View>

            {/* Deelnemerslijst */}
            <Text style={styles.participantsTitle}>Deelnemers:</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={renderUser}
                style={styles.userList}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nog geen deelnemers</Text>
                }
            />

            {/* Host-knoppen onderaan */}
            {isHost && (
                <View style={styles.hostControls}>
                    {/* Start Spel */}
                    <TouchableOpacity
                        style={[styles.button, { marginBottom: 12 }]}
                        onPress={() => router.push("../screen/HunterScreen")}
                    >
                        <Text style={styles.buttonText}>Start Spel</Text>
                    </TouchableOpacity>

                    {/* Spelinstellingen */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setSettingsVisible(true)}
                    >
                        <Text style={styles.buttonText}>Spelinstellingen</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Instellingen Pop-up (Modal) */}
            <Modal
                visible={settingsVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSettingsVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Spelinstellingen</Text>
                        <Text>⚙️ Instellingen komen hier...</Text>
                        <TouchableOpacity
                            onPress={() => setSettingsVisible(false)}
                            style={styles.modalCloseButton}
                        >
                            <Text style={styles.modalCloseText}>Sluit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default LobbyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1A1B25",
        padding: 20,
        alignItems: "center",
    },
    codeLabel: {
        fontSize: 16,
        color: "#ccc",
        marginTop: 20,
    },
    lobbyCode: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#8EFFA0",
        marginBottom: 10,
    },
    qrContainer: {
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 8,
        marginBottom: 20,
    },
    participantsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    userList: {
        width: "100%",
        marginBottom: 80, // ruimte laten voor de knoppen onderaan
    },
    emptyText: {
        color: "#aaa",
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 20,
    },
    userRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#2A2B35",
        marginBottom: 8,
        borderRadius: 8,
    },
    userName: {
        color: "#fff",
        fontSize: 16,
    },
    kickButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "#FF6B6B",
        borderRadius: 6,
    },
    kickText: {
        color: "#fff",
        fontWeight: "bold",
    },
    hostControls: {
        position: "absolute",
        bottom: 40,
        left: 20,
        right: 20,
    },
    button: {
        backgroundColor: "#8EFFA0",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#11121A",
        fontWeight: "bold",
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalCloseButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#8EFFA0",
        borderRadius: 8,
    },
    modalCloseText: {
        fontWeight: "bold",
        color: "#11121A",
    },
});
