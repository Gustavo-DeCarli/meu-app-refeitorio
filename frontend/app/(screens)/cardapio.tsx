import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
    ScrollView, View, StyleSheet, Alert, Share
} from 'react-native';
import { api } from '../(services)/api';
import { MenuCard } from '../(components)/MenuCard';
import { EditMenuModal } from '../(components)/EditMenuModal';

export default function Cardapio() {
    const { user } = useLocalSearchParams();
    const parsedUser = JSON.parse(user as string);

    const [menus, setMenus] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [editing, setEditing] = useState<any>(null);
    const [text, setText] = useState('');

    useEffect(() => {
        api.get('/menus').then(res => setMenus(res.data));
        api.get(`/favorites/${parsedUser.id}`).then(res => setFavorites(res.data));
    }, []);

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
    content: { padding: 16 }
});