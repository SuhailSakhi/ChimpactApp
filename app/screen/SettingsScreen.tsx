import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const SettingsScreen = () => {
    const router = useRouter();
    const [notificationsOn, setNotificationsOn] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Instellingen</Text>

            <TouchableOpacity
                style={styles.buttonRed}
                onPress={() => router.push("/privacy")}
            >
                <Text style={styles.buttonText}>Privacy</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonRed}
                onPress={() => router.push("/profile")}
            >
                <Text style={styles.buttonText}>Profielgegevens</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, notificationsOn ? styles.buttonGreen : styles.buttonRed]}
                onPress={() => setNotificationsOn((prev) => !prev)}
            >
                <Text style={styles.buttonText}>
                    Meldingen: {notificationsOn ? "Aan" : "Uit"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#11121A",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 40,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 20,
        width: "100%",
        alignItems: "center",
    },
    buttonRed: {
        backgroundColor: "#A32D2D",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 20,
        width: "100%",
        alignItems: "center",
    },
    buttonGreen: {
        backgroundColor: "#4CAF50",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
});
