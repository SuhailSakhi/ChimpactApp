import React, { useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    Easing,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";

const HomeScreen = () => {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        React.useCallback(() => {
            fadeAnim.setValue(0);  // Reset fade effect whenever screen is focused
            Animated.timing(fadeAnim, {
                toValue: 1,  // Opacity to 1 (fade in)
                duration: 1000,  // Fade-in duration
                easing: Easing.out(Easing.ease),  // Smooth easing
                useNativeDriver: true,
            }).start();
        }, [])
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.inner}>
                <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
                    Welkom bij Chimpact 🐒
                </Animated.Text>
                <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
                    Dit is je Home Screen
                </Animated.Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("../screens/HostGameScreen")}
                    >
                        <Text style={styles.buttonText}>Host Game</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("../screens/JoinGameScreen")}
                    >
                        <Text style={styles.buttonText}>Join Game</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1A1B25", // Zelfde als eindkleur WelcomeScreen
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // Voorkomt witte balken en andere overflow
    },
    inner: {
        flex: 1,
        width: "100%", // Zorg ervoor dat de breedte van de container gelijk is
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
        marginBottom: 40,
    },
    buttonContainer: {
        width: "100%",
        gap: 20,
    },
    button: {
        backgroundColor: "#8EFFA0",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#11121A",
        fontWeight: "bold",
        fontSize: 16,
    },
});