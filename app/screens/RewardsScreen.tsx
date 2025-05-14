import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

const RewardsScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welkom bij Chimpact 🐒</Text>
            <Text style={styles.subtitle}>Dit is je Rewards Screen</Text>
        </SafeAreaView>
    );
};

export default RewardsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#11121A",
        alignItems: "center",
        justifyContent: "center",
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


