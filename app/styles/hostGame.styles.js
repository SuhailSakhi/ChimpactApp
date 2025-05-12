// /app/styles/hostGame.styles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#11121A",
        alignItems: "center",
        paddingTop: 20,
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#FFBEBE",
        marginBottom: 10,
        textShadowColor: "#fff",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    label: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 10,
    },
    gameSelector: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    arrow: {
        color: "#fff",
        fontSize: 24,
        marginHorizontal: 10,
    },
    gameBox: {
        backgroundColor: "#8EFFA0",
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    gameText: {
        fontWeight: "bold",
        fontSize: 18,
    },
    toggleContainer: {
        flexDirection: "row",
        marginVertical: 10,
    },
    publicButton: {
        backgroundColor: "#4EFFA0",
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 10,
    },
    privateButton: {
        backgroundColor: "#FF7D7D",
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 10,
    },
    toggleText: {
        fontWeight: "bold",
        color: "#000",
    },
    dropdown: {
        marginTop: 10,
        alignItems: "center",
    },
    dropdownLabel: {
        color: "#fff",
        marginBottom: 5,
    },
    dropdownBox: {
        backgroundColor: "#8EFFA0",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    dropdownText: {
        color: "#000",
    },
    extraOptions: {
        flexDirection: "row",
        marginTop: 10,
    },
    optionGreen: {
        backgroundColor: "#4EFFA0",
        padding: 10,
        margin: 5,
        borderRadius: 10,
    },
    optionRed: {
        backgroundColor: "#FF7D7D",
        padding: 10,
        margin: 5,
        borderRadius: 10,
    },
    optionText: {
        color: "#000",
    },
    continueButton: {
        backgroundColor: "#8EFFA0",
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 20,
        marginTop: 30,
    },
    continueText: {
        fontWeight: "bold",
        color: "#000",
    },
    navbar: {
        position: "absolute",
        bottom: 0,
        height: 60,
        width: "100%",
        backgroundColor: "#1E1F29",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    navIcon: {
        fontSize: 20,
        color: "#fff",
    },
});

export default styles;
