import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import styles from "../styles/hostGame.styles"; // import de styles uit de map

export default function HostGameScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>HOST GAME</Text>

            <Text style={styles.label}>SELECT GAME</Text>
            <View style={styles.gameSelector}>
                <Text style={styles.arrow}>{"<"}</Text>
                <View style={styles.gameBox}>
                    <Text style={styles.gameText}>HIDEOUT</Text>
                </View>
                <Text style={styles.arrow}>{">"}</Text>
            </View>

            <View style={styles.toggleContainer}>
                <TouchableOpacity style={styles.publicButton}>
                    <Text style={styles.toggleText}>Publiek</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.privateButton}>
                    <Text style={styles.toggleText}>Privé</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dropdown}>
                <Text style={styles.dropdownLabel}>RADIUS</Text>
                <View style={styles.dropdownBox}>
                    <Text style={styles.dropdownText}>5 km ⌄</Text>
                </View>
            </View>

            <View style={styles.extraOptions}>
                <View style={styles.optionGreen}><Text style={styles.optionText}>XXXX</Text></View>
                <View style={styles.optionRed}><Text style={styles.optionText}>XXXX</Text></View>
            </View>
            <View style={styles.extraOptions}>
                <View style={styles.optionGreen}><Text style={styles.optionText}>XXXXX ⌄</Text></View>
            </View>

            <TouchableOpacity style={styles.continueButton}>
                <Text style={styles.continueText}>Ga door</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
