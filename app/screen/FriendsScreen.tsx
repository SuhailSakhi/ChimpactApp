import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

const initialFriends = ["Suhail", "Sem", "Aslihan", "Joris"];
const requests = [
    {
        name: "Diego",
        image: "https://randomuser.me/api/portraits/lego/6.jpg",
    },
];

const FriendsScreen = () => {
    const [friends, setFriends] = useState(initialFriends);
    const [modalVisible, setModalVisible] = useState(false);
    const [newFriend, setNewFriend] = useState("");

    const handleAddFriend = () => {
        if (newFriend.trim()) {
            setFriends((prev) => [...prev, newFriend.trim()]);
            setNewFriend("");
            setModalVisible(false);
        }
    };

    const handleRemoveFriend = (name: string) => {
        setFriends((prev) => prev.filter((friend) => friend !== name));
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.header}>Vrienden</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.plusButton}>
                    <FontAwesome name="plus" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Vriendenlijst */}
            <View style={styles.friendsList}>
                {friends.map((friend, index) => (
                    <View key={index} style={styles.friendCard}>
                        <FontAwesome name="user-circle" size={24} color="#ccc" style={{ marginRight: 10 }} />
                        <Text style={styles.friendText}>{friend}</Text>
                        <TouchableOpacity onPress={() => handleRemoveFriend(friend)} style={styles.removeButton}>
                            <FontAwesome name="close" size={18} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Verzoeken */}
            <Text style={styles.requestsTitle}>Vriendschapsverzoeken</Text>
            {requests.map((request, index) => (
                <View key={index} style={styles.requestCard}>
                    <Image source={{ uri: request.image }} style={styles.avatar} />
                    <Text style={styles.friendText}>{request.name}</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity style={{ marginRight: 10 }}>
                            <FontAwesome name="check" size={20} color="green" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <FontAwesome name="close" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            {/* Modal om vriend toe te voegen */}
            <Modal transparent animationType="slide" visible={modalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Voeg een vriend toe</Text>
                        <TextInput
                            placeholder="Naam"
                            placeholderTextColor="#888"
                            value={newFriend}
                            onChangeText={setNewFriend}
                            style={styles.input}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleAddFriend}>
                                <Text style={styles.modalButtonText}>Toevoegen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Annuleren</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default FriendsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#11121A",
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // zet de hele rij in het midden
        marginBottom: 30,
        position: "relative",
    },
    header: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
    },
    plusButton: {
        marginLeft: 10,
        padding: 4,
    },
    friendsList: {
        gap: 12,
        marginBottom: 30,
    },
    friendCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1C1C2A",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#444", // grijs randje zoals screenshot
    },
    friendText: {
        color: "#fff",
        fontSize: 16,
        flex: 1,
    },
    removeButton: {
        marginLeft: 10,
    },
    requestsTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 12,
    },
    requestCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1C1C2A",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#444",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
    },
    actions: {
        flexDirection: "row",
        marginLeft: "auto",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1C1C2A",
        padding: 20,
        borderRadius: 12,
        width: "80%",
    },
    modalTitle: {
        fontSize: 18,
        color: "#fff",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#333",
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    confirmButton: {
        backgroundColor: "#8EFFA0",
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
    },
    cancelButton: {
        backgroundColor: "#FF6B6B",
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 5,
    },
    modalButtonText: {
        color: "#11121A",
        textAlign: "center",
        fontWeight: "bold",
    },
});
