import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const HomeScreen = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Titel bovenaan */}
            <Text style={styles.title}>Home</Text>

            {/* Gecentreerde content */}
            <View style={styles.centerContent}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("/(tabs)/host")}
                    >
                        <Text style={styles.buttonText}>Spel aanmaken</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("/(tabs)/join")}
                    >
                        <Text style={styles.buttonText}>Spel zoeken</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#11121A",
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        paddingTop: 100,
    },
    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        gap: 20,
        marginTop: -200,
    },
    button: {
        backgroundColor: "#A32D2D",
        paddingVertical: 25,
        borderRadius: 50,
        alignItems: "center",
        width: "85%",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
    },
});
