import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Home() {
    const router = useRouter();
    const { user } = useLocalSearchParams();

    const parsedUser = JSON.parse(user as string);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Olá, {parsedUser.name}</Text>
                    <Text style={styles.badge}>
                        Acesso: {parsedUser.type.toUpperCase()}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => router.replace('/')}>
                    <Text style={styles.logout}>Sair</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Serviços</Text>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() =>
                        router.push({
                            pathname: '/cardapio',
                            params: { user }
                        })
                    }
                >
                    <Text style={styles.cardTitle}>Cardápio</Text>
                    <Text style={styles.cardDesc}>
                        Consulte os cardápios da semana
                    </Text>
                </TouchableOpacity>
                {parsedUser.type === 'servidor' && (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            router.push({
                                pathname: '/cadastrar-cardapio',
                                params: { user }
                            })
                        }
                    >
                        <Text style={styles.cardTitle}>Cadastrar Cardápio</Text>
                        <Text style={styles.cardDesc}>
                            Criar novo cardápio
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },

    header: {
        backgroundColor: '#15803d',
        padding: 20,
        paddingTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    welcome: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    badge: { color: '#dcfce7', fontSize: 12 },
    logout: { color: '#fff' },

    content: { padding: 16 },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16
    },

    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12
    },

    cardTitle: { fontWeight: 'bold', fontSize: 16 },
    cardDesc: { fontSize: 12, color: '#6b7280' }
});