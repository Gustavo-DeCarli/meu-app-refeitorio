import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ScrollView, View, StyleSheet, Share,
    TouchableOpacity, Text
} from 'react-native';
import { api } from '../../services/api';
import MenuCard from '../../components/MenuCard'
import EditMenuModal from '../../components/EditMenuModal';

export default function Cardapio() {
    const router = useRouter();
    const { user } = useLocalSearchParams();
    const parsedUser = JSON.parse(user as string);

    const [menus, setMenus] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [editing, setEditing] = useState<any>(null);
    const [text, setText] = useState('');

    // useEffect(() => {
    //     api.get('/menus').then(res => setMenus(res.data));
    //     api.get(`/favorites/${parsedUser.id}`).then(res => setFavorites(res.data));
    // }, []);

    useEffect(() => {
        const today = new Date();
        const dayOfWeek = today.getDay() || 7;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const formatDate = (date) => date.toISOString().split('T')[0];

        api.get('/menus', {
            params: {
                start: formatDate(startOfWeek),
                end: formatDate(endOfWeek)
            }
        }).then(res => setMenus(res.data));

        api.get(`/favorites/${parsedUser.id}`).then(res => setFavorites(res.data));
    }, [parsedUser.id]);

    const toggleFavorite = async (id: number) => {
        if (favorites.includes(id)) {
            await api.delete(`/favorites/${parsedUser.id}/${id}`);
            setFavorites(favorites.filter(f => f !== id));
        } else {
            await api.post('/favorites', {
                user_id: parsedUser.id,
                menu_id: id
            });
            setFavorites([...favorites, id]);
        }
    };

    const handleShare = (menu: any) => {
        Share.share({
            message: menu.items.join('\n')
        });
    };

    const save = async () => {
        if (!editing) return;

        const items = text.split('\n');

        await api.put(`/menus/${editing.id}`, { items });

        setMenus(prev =>
            prev.map(m => m.id === editing.id ? { ...m, items } : m)
        );

        setEditing(null);
    };

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
            <ScrollView style={styles.content}>
                {menus.map(menu => (
                    <MenuCard
                        key={menu.id}
                        menu={menu}
                        isFav={favorites.includes(menu.id)}
                        isServidor={parsedUser.type === 'servidor'}
                        onToggleFavorite={() => toggleFavorite(menu.id)}
                        onShare={() => handleShare(menu)}
                        onEdit={() => {
                            setEditing(menu);
                            setText(menu.items.join('\n'));
                        }}
                    />
                ))}
            </ScrollView>

            <EditMenuModal
                visible={!!editing}
                itemsText={text}
                setItemsText={setText}
                onClose={() => setEditing(null)}
                onSave={save}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    content: { padding: 16 },
    welcome: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    badge: { color: '#dcfce7', fontSize: 12 },
    logout: { color: '#fff' },
    header: {
        backgroundColor: '#15803d',
        padding: 20,
        paddingTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});