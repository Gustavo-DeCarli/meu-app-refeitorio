import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Menu } from '../(types)';

export function MenuCard({
    menu,
    isFav,
    isServidor,
    onToggleFavorite,
    onShare,
    onEdit
}: any) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{menu.meal_type}</Text>

                <View style={{ flexDirection: 'row' }}>
                    {isServidor && (
                        <TouchableOpacity onPress={onEdit}>
                            <Ionicons name="pencil" size={22} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={onToggleFavorite}>
                        <Ionicons
                            name={isFav ? "star" : "star-outline"}
                            size={22}
                            color={isFav ? "#eab308" : "#999"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onShare}>
                        <Ionicons name="share-social-outline" size={22} />
                    </TouchableOpacity>
                </View>
            </View>

            {menu.items.map((item: string, i: number) => (
                <Text key={i}>• {item}</Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16
    }
});