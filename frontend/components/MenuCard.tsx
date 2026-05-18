import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MenuCard({
    menu,
    isFav,
    isServidor,
    onToggleFavorite,
    onCopy,
    onEdit,
    onDelete,
}: any) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{menu.meal_type}</Text>

                <View style={styles.actions}>
                    {isServidor && (
                        <>
                            <TouchableOpacity
                                onPress={onEdit}
                                style={styles.iconButton}
                            >
                                <Ionicons
                                    name="pencil"
                                    size={20}
                                    color="#4b5563"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onDelete}
                                style={styles.iconButton}
                            >
                                <Ionicons
                                    name="trash"
                                    size={20}
                                    color="#ef4444"
                                />
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity
                        onPress={onToggleFavorite}
                        style={styles.iconButton}
                    >
                        <Ionicons
                            name={isFav ? "star" : "star-outline"}
                            size={20}
                            color={isFav ? "#eab308" : "#999"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onCopy}
                        style={styles.iconButton}
                    >
                        <Ionicons
                            name="copy-outline"
                            size={20}
                            color="#4b5563"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.subtitle}>{menu.date}</Text>
            {menu.items.map((item: string, i: number) => (
                <Text key={i} style={styles.itemText}>
                    • {item}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#1f2937",
        flex: 1,
    },
    subtitle: {
        color: "#6b7280",
        fontSize: 12,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 15,
        color: "#374151",
        marginBottom: 4,
    },
});
