// app/screen/ProfileScreen.tsx

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Vibration,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CloseButton from "@/components/CloseButton";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

// Gebruik dezelfde key als in HomeScreen en JoinGameScreen
const HOME_PROFILE_KEY = "@user_profile";

type ProfileData = {
    playerId: string;
    imageUri: string | null;
    username: string;
    age: string;
    gender: string;
};

export default function ProfileScreen() {
    const router = useRouter();

    // State voor profielvelden
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [editing, setEditing] = useState(false);

    // Null betekent: gebruiker nog niet in DB
    const [playerId, setPlayerId] = useState<string | null>(null);

    // Tijdens opslaan knop uitschakelen
    const [saving, setSaving] = useState(false);

    // Bij mount: laad profiel (incl. playerId) uit AsyncStorage
    useEffect(() => {
        (async () => {
            try {
                const json = await AsyncStorage.getItem(HOME_PROFILE_KEY);
                if (json) {
                    const data: ProfileData = JSON.parse(json);
                    setImageUri(data.imageUri);
                    setUsername(data.username);
                    setAge(data.age);
                    setGender(data.gender);
                    setPlayerId(data.playerId);
                }
            } catch (err) {
                console.warn("Fout bij lezen van AsyncStorage:", err);
            }
        })();
    }, []);

    // Helper: sla ProfileData op in AsyncStorage
    const saveProfileLocally = async (data: ProfileData) => {
        try {
            await AsyncStorage.setItem(HOME_PROFILE_KEY, JSON.stringify(data));
        } catch (err) {
            console.warn("Fout bij opslaan in AsyncStorage:", err);
        }
    };

    // Foto kiezen (alleen lokaal opslaan; DB slaat imageUri niet op)
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Toegang tot mediabibliotheek is vereist.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);

            if (playerId) {
                // Alleen opslaan in AsyncStorage
                await saveProfileLocally({
                    playerId,
                    imageUri: uri,
                    username,
                    age,
                    gender,
                });
            }
        }
    };

    // Wissel tussen “Wijzig profiel” en “Opslaan”
    const toggleEditing = async () => {
        if (editing) {
            // Gebruiker klikt op “Opslaan”
            if (!username.trim()) {
                Alert.alert("Fout", "Gebruikersnaam mag niet leeg zijn.");
                return;
            }

            setSaving(true);

            // 1) Als playerId bestaat, probeer te updaten
            if (playerId) {
                console.log(`Probeer UPDATE voor speler ${playerId} → naam = ${username.trim()}`);
                const { data: updateData, error: updateError } = await supabase
                    .from("players")
                    .update({ name: username.trim() })
                    .eq("id", playerId)
                    .select("id, name")
                    .maybeSingle(); // maybeSingle voorkomt error als geen rij

                if (updateError) {
                    console.error("UPDATE fout:", updateError);
                    Alert.alert("Fout bij bijwerken speler", updateError.message);
                    setSaving(false);
                    return;
                }

                // Als updateData null is, betekent dat er geen bestaande rij was
                if (updateData) {
                    console.log("UPDATE geslaagd, retour-data:", updateData);
                    await saveProfileLocally({
                        playerId,
                        imageUri,
                        username,
                        age,
                        gender,
                    });
                } else {
                    // Geen rij gevonden → val terug op INSERT
                    console.log(`Geen speler met ID ${playerId} gevonden, doe INSERT.`);
                    const nowIso = new Date().toISOString();
                    const { data: insertData, error: insertError } = await supabase
                        .from("players")
                        .insert([{ name: username.trim(), joined_at: nowIso }])
                        .select("id, name")
                        .single();

                    if (insertError || !insertData) {
                        console.error("INSERT fout:", insertError);
                        Alert.alert("Fout bij aanmaken speler", insertError?.message || "");
                        setSaving(false);
                        return;
                    }

                    const newId = insertData.id;
                    console.log("INSERT geslaagd, nieuwe ID:", newId);
                    setPlayerId(newId);

                    await saveProfileLocally({
                        playerId: newId,
                        imageUri,
                        username,
                        age,
                        gender,
                    });
                }
            } else {
                // 2) playerId is null → INSERT
                console.log(`Voer INSERT uit, nieuwe speler = ${username.trim()}`);
                const nowIso = new Date().toISOString();
                const { data: insertData, error: insertError } = await supabase
                    .from("players")
                    .insert([{ name: username.trim(), joined_at: nowIso }])
                    .select("id, name")
                    .single();

                if (insertError || !insertData) {
                    console.error("INSERT fout:", insertError);
                    Alert.alert("Fout bij aanmaken speler", insertError?.message || "");
                    setSaving(false);
                    return;
                }

                const newId = insertData.id;
                console.log("INSERT geslaagd, nieuwe ID:", newId);
                setPlayerId(newId);

                await saveProfileLocally({
                    playerId: newId,
                    imageUri,
                    username,
                    age,
                    gender,
                });
            }

            setSaving(false);
        }

        setEditing((prev) => !prev);
    };

    const handleDeleteAccount = () => {
        if (Platform.OS === "android") {
            Vibration.vibrate([0, 500, 200, 500, 200, 500], false);
        } else {
            Vibration.vibrate(1000);
        }
        Alert.alert("⚠️ Niet doen!", "pls.", [{ text: "😱", style: "default" }]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <CloseButton onPress={() => router.replace("/settings")} />

            <Text style={styles.title}>Profiel</Text>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.content}
            >
                <Image
                    source={
                        imageUri
                            ? { uri: imageUri }
                            : require("../../assets/images/diego.jpg")
                    }
                    style={styles.avatar}
                />

                <TouchableOpacity style={styles.smallButton} onPress={pickImage}>
                    <Text style={styles.smallButtonText}>Profielfoto wijzigen</Text>
                </TouchableOpacity>

                {editing ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Gebruikersnaam"
                            placeholderTextColor="#777"
                        />
                        <TextInput
                            style={styles.input}
                            value={age}
                            onChangeText={setAge}
                            placeholder="Leeftijd"
                            placeholderTextColor="#777"
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={toggleEditing}
                            disabled={saving}
                        >
                            <Text style={styles.buttonText}>
                                {saving ? "Bezig..." : "Opslaan"}
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.info}>Gebruikersnaam: {username}</Text>
                        <Text style={styles.info}>Leeftijd: {age}</Text>
                        <TouchableOpacity style={styles.button} onPress={toggleEditing}>
                            <Text style={styles.buttonText}>Wijzig profiel</Text>
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDeleteAccount}
                >
                    <Text style={styles.buttonText}>Account verwijderen</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#11121A",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 60,
        marginBottom: 30,
    },
    content: {
        alignItems: "center",
        width: "100%",
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    info: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 8,
        textAlign: "center",
    },
    input: {
        width: "80%",
        backgroundColor: "#1E1F2B",
        color: "#fff",
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#A32D2D",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 10,
        width: "60%",
        alignItems: "center",
    },
    deleteButton: {
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
    },
    smallButton: {
        backgroundColor: "#A32D2D",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 20,
    },
    smallButtonText: {
        color: "#ccc",
        fontSize: 14,
    },
});
