import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useRef, useCallback } from "react";
import {
    Animated,
    Easing,
    PanResponder,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from "react-native";

export default function WelcomeScreen() {
    const router = useRouter();
    const [swiping, setSwiping] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const swipeFadeAnim = useRef(new Animated.Value(1)).current;
    const swipeFadeAnimRef = useRef(1);

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

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const distance = Math.max(
                    Math.abs(gestureState.dx),
                    Math.abs(gestureState.dy)
                );

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
                    setTimeout(() => {
                        router.replace("/(tabs)/home");
                    }, 300);
                } else {
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
        <TouchableOpacity
            activeOpacity={1}
            style={styles.container}
            onPress={() => router.replace("/(tabs)/home")}
            {...panResponder.panHandlers}
        >
            <View style={styles.centerContent}>
                <Animated.Text
                    style={[
                        styles.title,
                        { opacity: Animated.multiply(fadeAnim, swipeFadeAnim) },
                    ]}
                >
                    UitJeTent 🎪
                </Animated.Text>
                <Animated.Text
                    style={[
                        styles.subtitle,
                        { opacity: Animated.multiply(fadeAnim, swipeFadeAnim) },
                    ]}
                >
                    De wereld wacht buiten op je{"\n"}
                    dus doe nu mee!
                </Animated.Text>

            </View>

            <Animated.Text
                style={[styles.hint, { opacity: Animated.multiply(fadeAnim, swipeFadeAnim) }]}
            >
                {swiping ? "Bezig met navigeren..." : "Tik of swipe om te starten met spelen!🙈"}
            </Animated.Text>

            <Image
                source={require("../../assets/images/monkey.png")}
                style={styles.monkey}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 60,
        paddingHorizontal: 20,
        backgroundColor: "#11121A",
    },
    centerContent: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#cccccc",
    },
    hint: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        marginBottom: 30,
    },
    monkey: {
        position: "absolute",
        bottom: 600,
        left: 0,
        width: 80,
        height: 80,
        marginLeft: -20, // duwt hem iets buiten het paddingframe
    },


});
