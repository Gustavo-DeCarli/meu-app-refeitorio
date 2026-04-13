import { useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import {
    ScrollView, View, StyleSheet, Share,
    TouchableOpacity, Text
} from 'react-native';
import { api } from '../../services/api';
import MenuCard from '../../components/MenuCard';
import EditMenuModal from '../../components/EditMenuModal';
import { useUser } from '../../contexts/UserContext';

export default function Cardapio() {
    const router = useRouter();
    const { user, setUser } = useUser();

    const [menus, setMenus] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [editing, setEditing] = useState<any>(null);
    const [text, setText] = useState('');

    if (!user) {
        return null;
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const dayOfWeek = today.getDay() || 7;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1);

    const weekDates = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d.toISOString().split('T')[0];
    });

    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    const favoriteMenus = menus.filter(m => favorites.includes(m.id));

    useEffect(() => {
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        api.get('/menus', {
            params: {
                start: formatDate(startOfWeek),
                end: formatDate(endOfWeek)
            }
        }).then(res => setMenus(res.data));

        api.get(`/favorites/${user.id}`).then(res => setFavorites(res.data));
    }, [user.id]);

    const toggleFavorite = async (id: number) => {
        if (favorites.includes(id)) {
            await api.delete(`/favorites/${user.id}/${id}`);
            setFavorites(favorites.filter(f => f !== id));
        } else {
            await api.post('/favorites', {
                user_id: user.id,
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

    const handleLogout = () => {
        setUser(null);
        router.replace('/login');
    };

    const renderMenuCard = (menu: any, dateStr: string) => (
        <MenuCard
            key={`menu-${menu.id}-${dateStr}`}
            menu={menu}
            isFav={favorites.includes(menu.id)}
            isServidor={user.type === 'servidor'}
            onToggleFavorite={() => toggleFavorite(menu.id)}
            onShare={() => handleShare(menu)}
            onEdit={() => {
                setEditing(menu);
                setText(menu.items.join('\n'));
            }}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Olá, {user.name}</Text>
                    <Text style={styles.badge}>
                        Acesso: {user.type.toUpperCase()}
                    </Text>
                </View>

                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logout}>Sair</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {favoriteMenus.length > 0 && (
                    <View style={styles.favoritesSection}>
                        <Text style={styles.favoritesTitle}>⭐ Seus Favoritos em Destaque</Text>
                        {favoriteMenus.map(menu => renderMenuCard(menu, menu.date))}
                    </View>
                )}

                <Text style={styles.sectionTitle}>Semana Atual</Text>
                {weekDates.map((dateStr, index) => {
                    const isToday = dateStr === todayStr;
                    const dayMenus = menus.filter(m => m.date === dateStr);

                    return (
                        <View
                            key={index}
                            style={[styles.dayContainer, isToday && styles.dayContainerToday]}
                        >
                            <View style={[styles.dayHeader, isToday && styles.dayHeaderToday]}>
                                <Text style={[styles.dayTitle, isToday && styles.textWhite]}>
                                    {diasSemana[index]} {isToday ? '(Hoje)' : ''}
                                </Text>
                            </View>

                            {dayMenus.length > 0 ? (
                                dayMenus.map(menu => renderMenuCard(menu, dateStr))
                            ) : (
                                <Text style={styles.noMenuText}>
                                    Sem cardápio para este dia.
                                </Text>
                            )}
                        </View>
                    );
                })}

                <View style={{ height: 40 }} />
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
    badge: { color: '#dcfce7', fontSize: 12, marginTop: 4 },
    logout: { color: '#fff', fontWeight: 'bold' },
    header: {
        backgroundColor: '#15803d',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    
    favoritesSection: {
        marginBottom: 24,
        backgroundColor: '#fef08a',
        padding: 12,
        borderRadius: 8,
    },
    favoritesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#854d0e',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 16,
    },
    dayContainer: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e7eb'
    },
    dayContainerToday: {
        borderColor: '#15803d',
        borderWidth: 2,
    },
    dayHeader: {
        backgroundColor: '#f9fafb',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    dayHeaderToday: {
        backgroundColor: '#15803d',
    },
    dayTitle: {
        fontWeight: 'bold',
        color: '#4b5563',
        fontSize: 16,
    },
    textWhite: {
        color: '#ffffff',
    },
    noMenuText: {
        padding: 16,
        color: '#9ca3af',
        fontStyle: 'italic',
        textAlign: 'center'
    }
});