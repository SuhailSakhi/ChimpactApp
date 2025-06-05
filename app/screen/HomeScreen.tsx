// app/screen/HomeScreen.tsx

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    ActivityIndicator,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

const HOME_PROFILE_KEY = "@user_profile";

const HomeScreen = () => {
    const router = useRouter();

    // In-memory staat voor opgeslagen profiel (of null als nog niet aangemaakt)
    const [profile, setProfile] = useState<{ playerId: string; username: string } | null>(
        null
    );

    // Staat voor modal & invoer, enkel nodig als er nog geen profiel bestaat
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Bij mount: laad profiel (playerId + username) uit AsyncStorage
    useEffect(() => {
        (async () => {
            const json = await AsyncStorage.getItem(HOME_PROFILE_KEY);
            if (json) {
                const data = JSON.parse(json) as {
                    playerId: string;
                    username: string;
                };
                setProfile({ playerId: data.playerId, username: data.username });
            }
        })();
    }, []);

    // “Spel aanmaken”: als profiel bestaat → direct naar HostGameScreen, anders modal
    const handleCreateGame = async () => {
        if (profile) {
            router.push({
                pathname: "/screen/HostGameScreen",
                params: {
                    playerId: profile.playerId,
                    playerName: profile.username,
                },
            });
        } else {
            setUsernameInput("");
            setModalVisible(true);
        }
    };

    // “Spel zoeken”: als profiel bestaat → direct naar JoinGameScreen, anders modal
    const handleSearchGame = () => {
        if (profile) {
            router.push({
                pathname: "/screen/JoinGameScreen",
                params: {
                    playerId: profile.playerId,
                    playerName: profile.username,
                },
            });
        } else {
            setUsernameInput("");
            setModalVisible(true);
        }
    };

    // Bij “OK” in de popup: maak nieuwe speler in DB + AsyncStorage en sla profiel op
    const handleSubmitUsername = async () => {
        if (!usernameInput.trim()) {
            Alert.alert("Fout", "Vul een gebruikersnaam in.");
            return;
        }

        setLoading(true);
        const nowIso = new Date().toISOString();

        // 1) Insert into “players” tabel
        const { data, error } = await supabase
            .from("players")
            .insert([{ name: usernameInput.trim(), joined_at: nowIso }])
            .select("id,name")
            .single();

        setLoading(false);

        if (error || !data) {
            Alert.alert("Fout bij aanmaken speler", error?.message || "");
            return;
        }

        // 2) Sla profiel lokaal op en update in-memory staat
        const profileData = { playerId: data.id, username: data.name };
        await AsyncStorage.setItem(HOME_PROFILE_KEY, JSON.stringify(profileData));
        setProfile(profileData);
        setModalVisible(false);

        // 3) Navigeer direct naar HostGameScreen (indien create) of JoinGameScreen (indien search)
        //    Hier kiezen we Create, omdat dit vanuit deze functie standaard “Spel aanmaken” afhandelt.
        router.push({
            pathname: "/screen/HostGameScreen",
            params: {
                playerId: data.id,
                playerName: data.name,
            },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welkom bij ChimpactApp!</Text>

            <TouchableOpacity style={styles.button} onPress={handleCreateGame}>
                <Text style={styles.buttonText}>Spel aanmaken</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { marginTop: 15 }]}
                onPress={handleSearchGame}
            >
                <Text style={styles.buttonText}>Spel zoeken</Text>
            </TouchableOpacity>

            {/* -------------------------------------------------------------
                Modal alleen als er nog geen profiel (playerId + username) is
            ------------------------------------------------------------- */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Vul je gebruikersnaam in</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Gebruikersnaam"
                            placeholderTextColor="#999"
                            value={usernameInput}
                            onChangeText={setUsernameInput}
                            editable={!loading}
                        />

                        {loading ? (
                            <ActivityIndicator size="large" color="#8EFFA0" />
                        ) : (
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        {
                                            flex: 1,
                                            marginRight: 8,
                                            minWidth: 0,
                                            paddingVertical: 10,
                                            paddingHorizontal: 20,
                                        },
                                    ]}
                                    onPress={handleSubmitUsername}
                                >
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        {
                                            backgroundColor: "#FF6B6B",
                                            flex: 1,
                                            minWidth: 0,
                                            paddingVertical: 10,
                                            paddingHorizontal: 20,
                                        },
                                    ]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Annuleren</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
            {/* ------------------------------------------------------------- */}
        </View>
    );
};

export default HomeScreen;

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
        marginBottom: 40,
    },
    button: {
        backgroundColor: "#8EFFA0",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: "center",
        minWidth: 200,
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
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#1F202A",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        color: "#FFFFFF",
        marginBottom: 15,
    },
    modalInput: {
        width: "100%",
        backgroundColor: "#2A2B35",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: "row",
        width: "100%",
    },
});
