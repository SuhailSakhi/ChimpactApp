// app/screen/HostGameScreen.tsx

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";

// Definieer een lijst van mogelijke games met bijbehorende afbeelding
const gameOptions = [
    {
        label: "HideOut",
        value: "hideout",
        image: require("../../assets/images/hideout.png"), // Bijvoorbeeld: pas pad aan zoals jouw assets-folder
    },
    {
        label: "Capture Flag",
        value: "capture_flag",
        image: require("../../assets/images/capture_flag.png"),
    },
    {
        label: "Tag",
        value: "tag",
        image: require("../../assets/images/tag.png"),
    },
    // Voeg hier naar wens extra games toe, met label, value en image
];

const HostGameScreen = () => {
    const router = useRouter();

    // Lees playerName uit de route-params
    const { playerName } = useLocalSearchParams<{
        playerName: string;
        playerId: string;
    }>();

    // Houd de index bij van de geselecteerde game in de gameOptions-array
    const [selectedGameIndex, setSelectedGameIndex] = useState(0);

    // Toegang: "publiek" of "privé"
    const [isPrivate, setIsPrivate] = useState<boolean>(true);

    // Radius dropdown (in meters)
    const [radius, setRadius] = useState<string>("500");

    // Starttijd dropdown (ISO-strings)
    const today = new Date();
    const timeOptions = [
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
    const [startTime, setStartTime] = useState<string>(timeOptions[0].value);

    // Hulpfunctie om lobbycode te genereren
    const generateLobbyCode = () => {
        return Math.floor(10000 + Math.random() * 90000).toString();
    };

    const handleContinue = async () => {
        // Valideer alle velden
        if (!playerName) {
            Alert.alert("Fout", "Gebruikersnaam ontbreekt.");
            return;
        }
        const code = generateLobbyCode();
        const nowIso = new Date().toISOString();

        // Stuur in naar Supabase
        const { error } = await supabase.from("lobbies").insert([
            {
                code,
                is_private: isPrivate,
                game_type: gameOptions[selectedGameIndex].value,
                radius: parseInt(radius, 10),
                start_time: startTime,
                created_at: nowIso,
                players: [playerName],
            },
        ]);

        if (error) {
            Alert.alert("Fout bij aanmaken lobby", error.message);
            return;
        }

        // Navigeer naar LobbyScreen met params
        router.push({
            pathname: "/screen/LobbyScreen",
            params: {
                code,
                isHost: "true",
                username: playerName,
            },
        });
    };

    // Navigeren tussen games met pijltjes
    const selectPreviousGame = () => {
        setSelectedGameIndex((prev) =>
            prev === 0 ? gameOptions.length - 1 : prev - 1
        );
    };
    const selectNextGame = () => {
        setSelectedGameIndex((prev) =>
            prev === gameOptions.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Toegevoegd: wegknop, absoluut gepositioneerd zodat de layout niet verschuift */}
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.closeButtonAbsolute}
            >
                <Image
                    source={require("../../assets/images/arrow-back.png")}
                    style={styles.closeIcon}
                />
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Spel aanmaken</Text>
                <Text style={styles.subtitle}>
                    Pas je lobby aan met de instellingen hieronder
                </Text>

                {/* Game-selectie sectie */}
                <View style={styles.gameSelector}>
                    <TouchableOpacity onPress={selectPreviousGame} style={styles.arrowBtn}>
                        <Text style={styles.arrowText}>{"<"}</Text>
                    </TouchableOpacity>

                    <Image
                        source={gameOptions[selectedGameIndex].image}
                        style={styles.gameImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.gameLabel}>
                        {gameOptions[selectedGameIndex].label}
                    </Text>

                    <TouchableOpacity onPress={selectNextGame} style={styles.arrowBtn}>
                        <Text style={styles.arrowText}>{">"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Toegang sectie */}
                <Text style={styles.sectionLabel}>TOEGANG</Text>
                <View style={styles.accessButtons}>
                    <TouchableOpacity
                        style={[
                            styles.accessBtn,
                            !isPrivate ? styles.accessBtnActive : styles.accessBtnInactive,
                        ]}
                        onPress={() => setIsPrivate(false)}
                    >
                        <Text
                            style={[
                                styles.accessText,
                                !isPrivate ? styles.accessTextActive : styles.accessTextInactive,
                            ]}
                        >
                            Publiek
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.accessBtn,
                            isPrivate ? styles.accessBtnActive : styles.accessBtnInactive,
                        ]}
                        onPress={() => setIsPrivate(true)}
                    >
                        <Text
                            style={[
                                styles.accessText,
                                isPrivate ? styles.accessTextActive : styles.accessTextInactive,
                            ]}
                        >
                            Privé
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Radius dropdown */}
                <Text style={styles.sectionLabel}>RADIUS</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={radius}
                        onValueChange={(val) => setRadius(val)}
                        style={styles.picker}
                        dropdownIconColor="#fff"
                    >
                        <Picker.Item label="500 m" value="500" />
                        <Picker.Item label="1000 m" value="1000" />
                        <Picker.Item label="1500 m" value="1500" />
                        <Picker.Item label="2000 m" value="2000" />
                        <Picker.Item label="5000 m" value="5000" />
                    </Picker>
                </View>

                {/* Tijd dropdown */}
                <Text style={styles.sectionLabel}>TIJD</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={startTime}
                        onValueChange={(val) => setStartTime(val)}
                        style={styles.picker}
                        dropdownIconColor="#fff"
                    >
                        {timeOptions.map((opt) => (
                            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                        ))}
                    </Picker>
                </View>

                {/* Ga door knop */}
                <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
                    <Text style={styles.continueText}>Ga door</Text>
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
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginTop: 20,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: "#CCCCCC",
        marginBottom: 20,
        textAlign: "center",
    },
    gameSelector: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },
    arrowBtn: {
        padding: 10,
    },
    arrowText: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
    },
    gameImage: {
        width: 200,
        height: 120,
        marginHorizontal: 10,
        borderRadius: 8,
        backgroundColor: "#2A2B35",
    },
    gameLabel: {
        position: "absolute",
        bottom: -20,
        width: 200,
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "500",
    },
    sectionLabel: {
        alignSelf: "flex-start",
        color: "#AAAAAA",
        fontSize: 12,
        marginTop: 20,
        marginBottom: 5,
    },
    accessButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    accessBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: "center",
    },
    accessBtnActive: {
        backgroundColor: "#8EFFA0",
    },
    accessBtnInactive: {
        backgroundColor: "#FF6B6B",
    },
    accessText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    accessTextActive: {
        color: "#11121A",
    },
    accessTextInactive: {
        color: "#FFFFFF",
    },
    pickerContainer: {
        width: "100%",
        backgroundColor: "#1F202A",
        borderRadius: 8,
        marginBottom: 10,
        overflow: "hidden",
    },
    picker: {
        height: 50,
        color: "#FFFFFF",
    },
    continueBtn: {
        marginTop: 30,
        backgroundColor: "#8EFFA0",
        paddingVertical: 15,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    continueText: {
        color: "#11121A",
        fontWeight: "bold",
        fontSize: 16,
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
