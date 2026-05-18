import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

export default function EditMenuModal({
    visible,
    itemsText,
    setItemsText,
    onClose,
    onSave,
}: any) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>Editar Cardápio</Text>

                    <TextInput
                        multiline
                        style={styles.input}
                        value={itemsText}
                        onChangeText={setItemsText}
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onSave}>
                            <Text>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#00000088",
        justifyContent: "center",
        padding: 20,
    },
    content: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    title: { fontWeight: "bold", marginBottom: 10 },
    input: {
        borderWidth: 1,
        padding: 10,
        height: 120,
        marginBottom: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
