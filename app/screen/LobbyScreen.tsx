// app/screen/LobbyScreen.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert,
    ScrollView,
    Image,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";

// Type voor spelers (array met strings)
type LobbyPlayer = string;

const LobbyScreen = () => {
    const router = useRouter();
    const { code, isHost: initialIsHost, username } = useLocalSearchParams<{
        code: string;
        isHost: "true" | "false";
        username: string;
    }>();

    console.log("▶ LobbyScreen mount: received params →", {
        code,
        initialIsHost,
        username,
    });

    // __________________ State
    const [players, setPlayers] = useState<LobbyPlayer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [lobbyId, setLobbyId] = useState<string | null>(null);

    // Ref om de allereerste kick‐check te skippen
    const initialLoadRef = useRef(true);

    // Ref om navigatie maar één keer na game start uit te voeren
    const hasNavigatedRef = useRef(false);

    // Host?“players[0] === username” (eerst toegevoegde speler is host)
    const isCurrentHost = players.length > 0 && players[0] === username;

    // ____________________ Database‐calls

    // --- Initial fetch:
    // Haal lobby‐document op: id, players, game_started, hunter
    const fetchInitialLobby = useCallback(async () => {
        if (!code) return;
        setLoading(true);

        const { data, error } = await supabase
            .from("lobbies")
            .select("id, players, game_started, hunter")
            .eq("code", code)        // code is varchar
            .single();

        setLoading(false);

        if (error || !data) {
            Alert.alert("Fout", "Kon lobby niet vinden.");
            return;
        }

        setLobbyId(data.id);
        setPlayers(data.players || []);
        console.log("▶ Initial fetch players:", data.players);

        // Als game al gestart is en we nog niet genavigeerd hebben,
        // navigeren we op basis van data.hunter:
        if (data.game_started && !hasNavigatedRef.current) {
            hasNavigatedRef.current = true;

            if (username === data.hunter) {
                router.replace({
                    pathname: "/screen/HunterScreen",
                    params: { lobbyCode: code, playerName: username },
                });
            } else {
                router.replace({
                    pathname: "/screen/RunnerScreen",
                    params: { lobbyCode: code, playerName: username },
                });
            }
        }
    }, [code, username, router]);

    useEffect(() => {
        fetchInitialLobby();
    }, [fetchInitialLobby]);

    // --- Periodieke fetch elke 2 seconden:
    // Houd players, game_started en hunter up-to-date
    const fetchPeriodic = useCallback(async () => {
        if (!code) return;

        const { data, error } = await supabase
            .from("lobbies")
            .select("players, game_started, hunter")
            .eq("code", code)
            .single();

        if (!error && data) {
            setPlayers(data.players || []);

            // Als het spel net gestart is en we nog niet genavigeerd hebben:
            if (data.game_started && !hasNavigatedRef.current) {
                hasNavigatedRef.current = true;

                if (username === data.hunter) {
                    router.replace({
                        pathname: "/screen/HunterScreen",
                        params: { lobbyCode: code, playerName: username },
                    });
                } else {
                    router.replace({
                        pathname: "/screen/RunnerScreen",
                        params: { lobbyCode: code, playerName: username },
                    });
                }
            }
        }
    }, [code, username, router]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchPeriodic();
        }, 2000);
        return () => clearInterval(interval);
    }, [fetchPeriodic]);

    // --- Realtime‐subscriptie op updates voor deze lobby:
    // Zo hoeven we niet steeds handmatig te poll-en.
    useEffect(() => {
        if (!lobbyId) return;

        const channel = supabase
            .channel(`lobby_updates_${lobbyId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "lobbies",
                    filter: `id=eq.${lobbyId}`,
                },
                (payload: any) => {
                    const updatedPlayers: LobbyPlayer[] = payload.new.players || [];
                    setPlayers(updatedPlayers);
                    console.log("▶ Realtime update players:", updatedPlayers);

                    // Als game net is begonnen:
                    if (payload.new.game_started && !hasNavigatedRef.current) {
                        hasNavigatedRef.current = true;

                        if (username === payload.new.hunter) {
                            router.replace({
                                pathname: "/screen/HunterScreen",
                                params: { lobbyCode: code, playerName: username },
                            });
                        } else {
                            router.replace({
                                pathname: "/screen/RunnerScreen",
                                params: { lobbyCode: code, playerName: username },
                            });
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [lobbyId, username, code, router]);

    // ____________________ Cleanup unmount:
    // Verwijder huidige user uit players‐array als je uit de App sluit.
    useEffect(() => {
        return () => {
            console.log(
                "▶ LobbyScreen cleanup: username:",
                username,
                "lobbyId:",
                lobbyId
            );
            if (!lobbyId || !username) return;

            (async () => {
                const { data: lobbyData, error: fetchError } = await supabase
                    .from("lobbies")
                    .select("players")
                    .eq("id", lobbyId)
                    .single();

                if (!fetchError && lobbyData) {
                    const existingPlayers: string[] = lobbyData.players || [];
                    const updatedPlayers = existingPlayers.filter((p) => p !== username);

                    await supabase
                        .from("lobbies")
                        .update({ players: updatedPlayers })
                        .eq("id", lobbyId);
                }
            })();
        };
    }, [lobbyId, username]);
    // ------------------------------------------------------------------------------

    // Host kan andere gebruikers kicken
    const kickUser = async (playerName: string) => {
        if (!lobbyId) return;
        const updatedPlayers = players.filter((p) => p !== playerName);

        const { error } = await supabase
            .from("lobbies")
            .update({ players: updatedPlayers })
            .eq("id", lobbyId);

        if (error) {
            Alert.alert("Fout bij verwijderen speler", error.message);
        }
    };

    // Als een niet‐host uit de players‐lijst verdwijnt → terug naar home
    useEffect(() => {
        if (!isCurrentHost && username) {
            if (initialLoadRef.current) {
                initialLoadRef.current = false;
                return;
            }
            const stillInLobby = players.includes(username);
            if (!stillInLobby) {
                Alert.alert("Je bent gekickt", "Je bent uit de lobby verwijderd.", [
                    {
                        text: "OK",
                        onPress: () => {
                            router.replace("/");
                        },
                    },
                ]);
            }
        }
    }, [players, isCurrentHost, username, router]);
    // ------------------------------------------------------------------------------

    // Render één rij met username (+ “(Host)” als idx=0)
    const renderUser = (playerName: LobbyPlayer, idx: number) => {
        const isThisHost = idx === 0;
        return (
            <View key={playerName} style={styles.userRow}>
                <Text style={styles.userName}>
                    {playerName}
                    {isThisHost ? " (Host)" : ""}
                </Text>
                {isCurrentHost && !isThisHost && (
                    <TouchableOpacity
                        onPress={() => kickUser(playerName)}
                        style={styles.kickButton}
                    >
                        <Text style={styles.kickText}>Kick</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // ____________________ Start Spel: wijs random hunter toe, update in DB
    const handleStartGame = async () => {
        if (!lobbyId || players.length === 0) return;

        // Kies random speler uit players-array
        const randomIndex = Math.floor(Math.random() * players.length);
        const chosenHunter = players[randomIndex];

        // Update lobby‐rij: zet game_started en hunter
        const { error } = await supabase
            .from("lobbies")
            .update({ game_started: true, hunter: chosenHunter })
            .eq("id", lobbyId);

        if (error) {
            Alert.alert("Fout bij starten spel", error.message);
        }
        // Nadien navigatie voor alle clients via realtime‐subscriber
    };

    // ____________________ Renderen / Return

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8EFFA0" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
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

            <Text style={styles.codeLabel}>Lobby Code:</Text>
            <Text style={styles.lobbyCode}>{code}</Text>
            <QRCode value={code} size={160} backgroundColor="#fff" />

            <Text style={styles.participantsTitle}>Deelnemers:</Text>
            <ScrollView style={styles.userList}>
                {players.map((player, idx) => renderUser(player, idx))}
            </ScrollView>

            {isCurrentHost && (
                <View style={styles.hostControls}>
                    <TouchableOpacity style={styles.button} onPress={handleStartGame}>
                        <Text style={styles.buttonText}>Start Spel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setSettingsVisible(true)}
                    >
                        <Text style={styles.buttonText}>Spelinstellingen</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Instellingen Pop-up */}
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
    loadingContainer: {
        flex: 1,
        backgroundColor: "#1A1B25",
        justifyContent: "center",
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
    participantsTitle: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    userList: {
        width: "100%",
        marginTop: 10,
        maxHeight: 250,
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
        gap: 15,
        alignItems: "center",
    },
    button: {
        backgroundColor: "#8EFFA0",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
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

