import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "../types";

export default function Header({
    user,
    onLogout,
}: {
    user: User;
    onLogout: () => void;
}) {
    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>Olá, {user.name}</Text>
                <Text style={styles.badge}>{user.type.toUpperCase()}</Text>
            </View>

            <TouchableOpacity onPress={onLogout}>
                <Ionicons name="log-out-outline" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#15803d",
        padding: 20,
        paddingTop: 60,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    badge: { color: "#dcfce7", fontSize: 12 },
});
