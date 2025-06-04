// app/screen/HomeScreen.tsx

import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

const HomeScreen = () => {
    const router = useRouter();

    // Staat van de modal (popup) en de invoer voor gebruikersnaam
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // “Spel aanmaken” opent de modal
    const handleCreateGame = () => {
        setUsername("");
        setModalVisible(true);
    };

    // “Spel zoeken” navigeert rechtstreeks naar JoinGameScreen
    const handleSearchGame = () => {
        router.push({ pathname: "/screen/JoinGameScreen" });
    };

    // Bij “OK” in de modal: maak speler aan en ga naar HostGameScreen
    const handleSubmitUsername = async () => {
        if (!username.trim()) {
            Alert.alert("Fout", "Vul een gebruikersnaam in.");
            return;
        }

        setLoading(true);
        const nowIso = new Date().toISOString();

        // 1. Insert in tabel “players”
        const { data, error } = await supabase
            .from("players")
            .insert([
                {
                    name: username.trim(),
                    joined_at: nowIso,
                },
            ])
            .select("id,name")
            .single();

        setLoading(false);

        if (error) {
            Alert.alert("Fout bij aanmaken speler", error.message);
            return;
        }

        // 2. Sluit de modal en navigeer naar HostGameScreen met playerId + playerName
        setModalVisible(false);
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

            {/* Spel aanmaken */}
            <TouchableOpacity style={styles.button} onPress={handleCreateGame}>
                <Text style={styles.buttonText}>Spel aanmaken</Text>
            </TouchableOpacity>

            {/* Spel zoeken */}
            <TouchableOpacity
                style={[styles.button, { marginTop: 15 }]}
                onPress={handleSearchGame}
            >
                <Text style={styles.buttonText}>Spel zoeken</Text>
            </TouchableOpacity>

            {/* -------------------------------------------------------------
          Modal: vraag om gebruikersnaam voordat we doorgaan
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

    /* Modal-styling */
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
