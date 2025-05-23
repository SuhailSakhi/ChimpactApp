import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);

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
            setImageUri(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Profiel</Text>

            <View style={styles.content}>
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

                <Text style={styles.info}>Gebruikersnaam: Diego</Text>
                <Text style={styles.info}>Leeftijd: 12</Text>
                <Text style={styles.info}>Geslacht: x</Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Registreren</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Gebruikersnaam wijzigen</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;

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
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75, // ✅ helft van de breedte/hoogte
        marginBottom: 20,
    },

    info: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 4,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#A32D2D",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
        width: "80%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
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
