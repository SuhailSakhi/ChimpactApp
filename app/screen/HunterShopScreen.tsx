import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CloseButton from "@/components/CloseButton";
import { hunterShopItems, ShopItem } from "../data/shopItems";
import { useRouter } from "expo-router";
import { useGameTimer } from "@/context/GameTimerContext"; // ⬅️ Timer context import

export default function HunterShopScreen() {
    const [coins, setCoins] = useState(100); // voorbeeldwaarde
    const router = useRouter();
    const { addTime } = useGameTimer(); // ⬅️ Timer functie

    const handleBuy = (item: ShopItem) => {
        if (coins >= item.price) {
            setCoins(coins - item.price);
            alert(`${item.name} gekocht!`);

            // ⏱️ Power-up: 5 minuten extra tijd
            if (item.id === 2) {
                addTime(300); // +5 min
                return;
            }

            // 👀 Power-up "Hint": runners tijdelijk zichtbaar
            if (item.id === 3) {
                router.push({
                    pathname: "/hunter",
                    params: { showRunners: "true" },
                });
                return;
            }
        } else {
            alert("Niet genoeg coins.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <CloseButton onPress={() => router.replace("/hunter")} />
            <View style={styles.container}>
                <Text style={styles.title}>Shop</Text>
                <Text style={styles.subtitle}>Koop power-ups om je op weg te helpen!</Text>
                <Text style={styles.coinsText}>🪙 {coins} coins</Text>

                <ScrollView contentContainerStyle={{ gap: 15, paddingBottom: 40 }}>
                    {hunterShopItems.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Text style={styles.emoji}>{item.emoji}</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemTitle}>{item.name}</Text>
                                <Text style={styles.itemDescription}>{item.description}</Text>
                            </View>
                            <Text style={styles.price}>{item.price} coins</Text>
                            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(item)}>
                                <Text style={styles.buyText}>KOOP</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.footerButton}
                        onPress={() => router.push("/hunter")}
                    >
                        <Text style={styles.footerText}>Map</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.footerButton}
                        onPress={() => router.push("/hunterchallenges")}
                    >
                        <Text style={styles.footerText}>Challenges</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#11121A" },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
    title: { fontSize: 28, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 8 },
    subtitle: { color: "#ccc", fontSize: 14, textAlign: "center", marginBottom: 20 },
    card: {
        backgroundColor: "#1E1F2B",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
    },
    emoji: { fontSize: 30 },
    itemTitle: { fontWeight: "bold", fontSize: 16, color: "#fff" },
    itemDescription: { fontSize: 13, color: "#ccc", marginTop: 2 },
    price: { fontSize: 13, color: "#8EFFA0", fontWeight: "bold", marginLeft: "auto" },
    buyButton: { backgroundColor: "#2ECC71", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    buyText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
    footer: { gap: 15, marginTop: 20 },
    footerButton: {
        backgroundColor: "#A32D2D",
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    footerText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
    coinsText: {
        fontSize: 16,
        color: "#8EFFA0",
        textAlign: "center",
        marginBottom: 10,
        fontWeight: "bold",
    },
});
