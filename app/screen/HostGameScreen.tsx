// app/screen/HostGameScreen.tsx

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    ScrollView,
    Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";

const HostGameScreen = () => {
    const router = useRouter();

    // 1) Lees hier de route-params in, waaronder playerName
    const { playerName } = useLocalSearchParams<{
        playerName: string;
        playerId: string; // als je playerId ook gebruikt
    }>();

    // States voor dropdowns
    const [gameType, setGameType] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(true);
    const [radius, setRadius] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");

    // Opties voor “Type spel”
    const gameTypeOptions = [
        { label: "Tag", value: "tag" },
        { label: "Capture the Flag", value: "ctf" },
        { label: "Hide and Seek", value: "hide_and_seek" },
        // … voeg naar wens extra types toe
    ];

    // Opties voor “Radius”
    const radiusOptions = [
        { label: "500 m", value: "500" },
        { label: "1000 m", value: "1000" },
        { label: "1500 m", value: "1500" },
        { label: "2000 m", value: "2000" },
    ];

    // Opties voor “Starttijd” als ISO-timestamps van vandaag
    const today = new Date();
    const startTimeOptions = [
        {
            label: "18:00",
            value: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                18,
                0,
                0
            ).toISOString(),
        },
        {
            label: "18:30",
            value: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                18,
                30,
                0
            ).toISOString(),
        },
        {
            label: "19:00",
            value: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                19,
                0,
                0
            ).toISOString(),
        },
        {
            label: "19:30",
            value: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                19,
                30,
                0
            ).toISOString(),
        },
        {
            label: "20:00",
            value: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                20,
                0,
                0
            ).toISOString(),
        },
    ];

    // Helper om een unieke lobbycode te genereren
    const generateLobbyCode = () => {
        return Math.floor(10000 + Math.random() * 90000).toString();
    };

    const handleContinue = async () => {
        // Valideer dat alle dropdowns een waarde hebben
        if (!gameType || !radius || !startTime) {
            Alert.alert("Fout", "Vul alstublieft alle velden in.");
            return;
        }

        // 2) Genereer lobbycode en timestamp
        const code = generateLobbyCode();
        const nowIso = new Date().toISOString();

        // 3) Insert in “lobbies”, waarbij we de playerName als eerste element in de players-array zetten
        const { error } = await supabase.from("lobbies").insert([
            {
                code,                                   // varchar, niet null
                is_private: isPrivate,                  // bool, niet null
                game_type: gameType,                    // text, niet null
                radius: parseInt(radius, 10),           // int8, niet null
                start_time: startTime,                  // timestamp, niet null
                created_at: nowIso,                     // timestamp, niet null
                players: playerName ? [playerName] : [],// text[], niet null  ← hostnaam toegevoegd
            },
        ]);

        if (error) {
            Alert.alert("Fout bij aanmaken lobby", error.message);
            return;
        }

        // 4) Navigeer naar LobbyScreen met de gegenereerde code en isHost=true
        router.push({
            pathname: "/screen/LobbyScreen",
            params: { code, isHost: "true" },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Host Game</Text>
                <Text style={styles.subtitle}>Stel je lobby in:</Text>

                {/* Dropdown “Type spel” */}
                <View style={styles.input}>
                    <Picker
                        selectedValue={gameType}
                        onValueChange={(val) => setGameType(val)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecteer type spel" value="" />
                        {gameTypeOptions.map((opt) => (
                            <Picker.Item
                                key={opt.value}
                                label={opt.label}
                                value={opt.value}
                            />
                        ))}
                    </Picker>
                </View>

                {/* Toggle “Private lobby” */}
                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Private lobby:</Text>
                    <Switch
                        value={isPrivate}
                        onValueChange={setIsPrivate}
                        thumbColor="#8EFFA0"
                        trackColor={{ false: "#777", true: "#8EFFA0" }}
                    />
                </View>

                {/* Dropdown “Radius” */}
                <View style={styles.input}>
                    <Picker
                        selectedValue={radius}
                        onValueChange={(val) => setRadius(val)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecteer radius" value="" />
                        {radiusOptions.map((opt) => (
                            <Picker.Item
                                key={opt.value}
                                label={opt.label}
                                value={opt.value}
                            />
                        ))}
                    </Picker>
                </View>

                {/* Dropdown “Starttijd” */}
                <View style={styles.input}>
                    <Picker
                        selectedValue={startTime}
                        onValueChange={(val) => setStartTime(val)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecteer starttijd" value="" />
                        {startTimeOptions.map((opt) => (
                            <Picker.Item
                                key={opt.value}
                                label={opt.label}
                                value={opt.value}
                            />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HostGameScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#11121A",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#8EFFA0",
        marginBottom: 10,
        alignSelf: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#FFFFFF",
        marginBottom: 20,
        alignSelf: "center",
    },
    input: {
        width: "100%",
        backgroundColor: "#1F202A",
        borderRadius: 8,
        marginBottom: 15,
        overflow: "hidden",
    },
    picker: {
        height: 50,
        color: "#FFFFFF",
    },
    switchContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    label: {
        color: "#fff",
        fontSize: 16,
    },
    button: {
        marginTop: 30,
        backgroundColor: "#8EFFA0",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        color: "#11121A",
        fontWeight: "bold",
        fontSize: 16,
    },
});
