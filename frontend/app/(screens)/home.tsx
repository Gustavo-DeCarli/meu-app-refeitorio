import { Redirect, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { useEffect } from 'react';

export default function Home() {
    const router = useRouter();
    const { user, setUser } = useUser();

    if (!user) {
        return <Redirect href="/login" />;
    }

    const handleLogout = () => {
        setUser(null);
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.welcome}>Olá, {user?.name}</Text>
                    <Text style={styles.badge}>
                        Acesso: {user?.type.toUpperCase()}
                    </Text>
                </View>

                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logout}>Sair</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Serviços</Text>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push('/cardapio')}
                >
                    <Text style={styles.cardTitle}>Cardápio</Text>
                    <Text style={styles.cardDesc}>
                        Consulte os cardápios da semana
                    </Text>
                </TouchableOpacity>

                {user?.type === 'servidor' && (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push('/cadastrar-cardapio')}
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
        alignItems: 'center'
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    backText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold'
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
        borderRadius: 12,
        marginTop: 5
    },

    cardTitle: { fontWeight: 'bold', fontSize: 16 },
    cardDesc: { fontSize: 12, color: '#6b7280' }
});