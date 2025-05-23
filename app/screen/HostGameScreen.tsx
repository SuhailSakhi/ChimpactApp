import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

const HostGameScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Host Game</Text>
            <Text style={styles.subtitle}>Dit is het host scherm</Text>
        </SafeAreaView>
    );
};

export default HostGameScreen;

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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#ffffff",
    },
});
