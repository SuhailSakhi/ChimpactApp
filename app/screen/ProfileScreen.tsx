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

const PROFILE_KEY = "@user_profile";

type ProfileData = {
    imageUri: string | null;
    username: string;
    age: string;
    gender: string;
};

export default function ProfileScreen() {
    const router = useRouter();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [username, setUsername] = useState("Diego");
    const [age, setAge] = useState("12");
    const [gender, setGender] = useState("x");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const json = await AsyncStorage.getItem(PROFILE_KEY);
                if (json) {
                    const data: ProfileData = JSON.parse(json);
                    setImageUri(data.imageUri);
                    setUsername(data.username);
                    setAge(data.age);
                    setGender(data.gender);
                }
            } catch {
                // fallback naar defaults
            }
        })();
    }, []);

    const saveProfile = async (data: ProfileData) => {
        try {
            await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data));
        } catch {
            // foutbehandeling indien nodig
        }
    };

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
            await saveProfile({ imageUri: uri, username, age, gender });
        }
    };

    const toggleEditing = async () => {
        if (editing) {
            await saveProfile({ imageUri, username, age, gender });
        }
        setEditing((prev) => !prev);
    };

    const handleDeleteAccount = () => {
        // Amber-alert-achtig patroon: op Android patroon, op iOS lange vibratie
        if (Platform.OS === "android") {
            Vibration.vibrate([0, 500, 200, 500, 200, 500], false);
        } else {
            Vibration.vibrate(100000); // 1 seconde op iOS
        }

        Alert.alert(
            "⚠️ Niet doen!",
            "pls.",
            [{ text: "😱", style: "default" }]
        );
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
                        <TouchableOpacity style={styles.button} onPress={toggleEditing}>
                            <Text style={styles.buttonText}>Opslaan</Text>
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
