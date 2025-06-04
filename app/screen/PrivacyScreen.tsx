import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import CloseButton from "@/components/CloseButton";
import { useRouter } from "expo-router";

export default function PrivacyScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Close-button rechtsboven */}
            <CloseButton onPress={() => router.replace("/settings")} />

            <Text style={styles.title}>Privacybeleid</Text>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.paragraph}>
                    Wij hechten veel waarde aan jouw privacy. Hieronder lees je hoe wij omgaan met
                    jouw persoonsgegevens:
                </Text>

                <Text style={styles.subtitle}>1. Welke gegevens verzamelen we?</Text>
                <Text style={styles.paragraph}>
                    • Profielinformatie: jouw gebruikersnaam, leeftijd en profielfoto.{"\n"}
                    • Locatiegegevens: tijdens het spelen wordt je GPS-locatie tijdelijk gebruikt om
                    de gamefunctie (hunter vs. runner) mogelijk te maken. Deze data slaan we niet langer
                    op dan nodig voor het spel.
                </Text>

                <Text style={styles.subtitle}>2. Hoe gebruiken we jouw gegevens?</Text>
                <Text style={styles.paragraph}>
                    • Enkel voor de app-functionaliteit: matchen van spelers, tonen van emoji-markers
                    op de kaart en timers.{"\n"}
                    • We delen jouw gegevens niet met derden, tenzij we daartoe wettelijk verplicht zijn.
                </Text>

                <Text style={styles.subtitle}>3. Bewaartermijn</Text>
                <Text style={styles.paragraph}>
                    Profielgegevens bewaren we zolang je account actief is. Locatiegegevens worden
                    tijdens het spelen regelmatig overschreven en niet langer bewaard dan strikt nodig.
                </Text>

                <Text style={styles.subtitle}>4. Hoe beveiligen we jouw data?</Text>
                <Text style={styles.paragraph}>
                    We gebruiken beveiligde (HTTPS) verbindingen en versleuteling om jouw data te
                    beschermen. Alleen geautoriseerd personeel heeft toegang tot serverdata.
                </Text>

                <Text style={styles.subtitle}>5. Jouw rechten</Text>
                <Text style={styles.paragraph}>
                    Je hebt het recht om je gegevens in te zien, te corrigeren of te verwijderen. Neem
                    hiervoor contact op via support@voorbeeld.nl.{"\n"}
                    Door onze app te gebruiken, stem je in met dit privacybeleid. We kunnen dit beleid
                    bijwerken; wijzigingen worden in de app gecommuniceerd.
                </Text>

                <Text style={styles.subtitle}>6. Contact</Text>
                <Text style={styles.paragraph}>
                    Bij klachten of vragen over dit privacybeleid kun je contact opnemen met Aslihan.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#11121A",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    content: {
        paddingBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        color: "#ccc",
        lineHeight: 22,
    },
});
