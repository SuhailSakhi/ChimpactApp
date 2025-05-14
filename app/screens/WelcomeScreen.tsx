import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useRef, useCallback } from "react";
import {
    Animated,
    Easing,
    PanResponder,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function WelcomeScreen() {
    const router = useRouter();
    const [swiping, setSwiping] = useState(false);

    // Animatie refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const swipeFadeAnim = useRef(new Animated.Value(1)).current;
    const swipeFadeAnimRef = useRef(1); // Houdt de huidige waarde van swipeFadeAnim bij

    // Reset animaties bij terugkeren naar scherm
    useFocusEffect(
        useCallback(() => {
            fadeAnim.setValue(0);
            swipeFadeAnim.setValue(1);
            swipeFadeAnimRef.current = 1;

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        }, [])
    );

    // Swipe handling
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const distance = Math.max(
                    Math.abs(gestureState.dx),
                    Math.abs(gestureState.dy)
                );

                // Begin fade tijdens swipe
                if (distance > 20 && swipeFadeAnimRef.current === 1) {
                    Animated.timing(swipeFadeAnim, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }).start(() => {
                        swipeFadeAnimRef.current = 0;
                    });
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                const distance = Math.max(
                    Math.abs(gestureState.dx),
                    Math.abs(gestureState.dy)
                );

                if (distance > 80 && swipeFadeAnimRef.current === 0) {
                    setSwiping(true);

                    // Vertraging vóór navigatie
                    setTimeout(() => {
                        router.push("../screens/HomeScreen");
                    }, 300);
                } else {
                    // Swipe niet ver genoeg, reset animatie
                    Animated.timing(swipeFadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        swipeFadeAnimRef.current = 1;
                        setSwiping(false);
                    });
                }
            },
        })
    ).current;

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            <Animated.Text style={[styles.title, { opacity: Animated.multiply(fadeAnim, swipeFadeAnim) }]}>
                Welkom bij Chimpact!
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, { opacity: Animated.multiply(fadeAnim, swipeFadeAnim) }]}>
                {swiping ? "Bezig met navigeren..." : "Swipe in om het avontuur te starten 🚀"}
            </Animated.Text>
            <Animated.Text style={[styles.hint, { opacity: Animated.multiply(fadeAnim, swipeFadeAnim) }]}>
                Swipe in eender welke richting om verder te gaan.
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#11121A",  // Achtergrond kleur blijft hetzelfde
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#8EFFA0",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: "#ffffff",
        marginBottom: 20,
        textAlign: "center",
    },
    hint: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
});
