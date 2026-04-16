import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import {
    ScrollView,
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Alert
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { api } from '../../services/api'
import MenuCard from '../../components/MenuCard'
import EditMenuModal from '../../components/EditMenuModal'
import { useUser } from '../../contexts/UserContext'

export default function Cardapio() {
    const router = useRouter()
    const { user, setUser } = useUser()

    const [menus, setMenus] = useState<any[]>([])
    const [favorites, setFavorites] = useState<number[]>([])
    const [isEditing, setIsEditing] = useState<any>(null)
    const [menuText, setMenuText] = useState('')

    if (!user) return null

    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const dayOfWeek = today.getDay() || 7
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1)

    const weekDates = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(startOfWeek)
        d.setDate(startOfWeek.getDate() + i)
        return d.toISOString().split('T')[0]
    })

    const labelsDias = [
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
        'Domingo'
    ]

    const favoriteList = menus.filter(m => favorites.includes(m.id))

    const fetchItems = async () => {
        try {
            const endOfWeek = new Date(startOfWeek)
            endOfWeek.setDate(startOfWeek.getDate() + 6)
            const formatDate = (date: Date) => date.toISOString().split('T')[0]

            const [menusRes, favsRes] = await Promise.all([
                api.get('/menus', {
                    params: {
                        start: formatDate(startOfWeek),
                        end: formatDate(endOfWeek)
                    }
                }),
                api.get(`/favorites/${user.id}`)
            ])

            setMenus(menusRes.data)
            setFavorites(favsRes.data)
        } catch (err) {
            console.error("Erro ao carregar dados", err)
        }
    }

    useEffect(() => {
        fetchItems()
    }, [user.id])

    const handleToggleFavorite = async (id: number) => {
        try {
            if (favorites.includes(id)) {
                await api.delete(`/favorites/${user.id}/${id}`)
                setFavorites(prev => prev.filter(f => f !== id))
            } else {
                await api.post('/favorites', {
                    user_id: user.id,
                    menu_id: id
                })
                setFavorites(prev => [...prev, id])
            }
        } catch (error) {
            Alert.alert("Erro", "Nao foi possivel atualizar favoritos")
        }
    }

    const onCopyAction = async (menu: any) => {
        const [y, m, d] = menu.date.split('-')
        const dateFormatted = `${d}/${m}/${y}`

        const content = `Cardapio do Dia - ${dateFormatted}\n\n${menu.meal_type}\n${menu.items.map((i: string) => `- ${i}`).join('\n')}`

        await Clipboard.setStringAsync(content)
        Alert.alert('Sucesso', 'Copiado para o clipboard')
    }

    const onSaveUpdate = async () => {
        if (!isEditing) return
        const items = menuText.split('\n').filter(i => i.trim() !== '')

        try {
            await api.put(`/menus/${isEditing.id}`, { items })
            setMenus(prev => prev.map(m => (m.id === isEditing.id ? { ...m, items } : m)))
            setIsEditing(null)
        } catch (e) {
            Alert.alert("Erro", "Falha ao salvar alteracoes")
        }
    }

    const removeMenu = async (id: number) => {
        try {
            await api.delete(`/menus/${id}`)
            setMenus(prev => prev.filter(m => m.id !== id))
        } catch (error) {
            console.log('Erro delete:', error)
        }
    }

    const logout = () => {
        setUser(null)
        router.replace('/login')
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
                    <Text style={styles.btnText}>←</Text>
                </TouchableOpacity>

                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.userName}>Ola, {user.name}</Text>
                    <Text style={styles.roleTag}>Role: {user.type.toUpperCase()}</Text>
                </View>

                <TouchableOpacity onPress={logout}>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollPadding}>
                {favoriteList.length > 0 && (
                    <View style={styles.favBox}>
                        <Text style={styles.favLabel}>Favoritos em Destaque</Text>
                        {favoriteList.map(menu => (
                            <MenuCard
                                key={`fav-${menu.id}`}
                                menu={menu}
                                isFav={true}
                                isServidor={user.type === 'servidor'}
                                onToggleFavorite={() => handleToggleFavorite(menu.id)}
                                onCopy={() => onCopyAction(menu)}
                                onEdit={() => {
                                    setIsEditing(menu)
                                    setMenuText(menu.items.join('\n'))
                                }}
                                onDelete={() => removeMenu(menu.id)}
                            />
                        ))}
                    </View>
                )}

                <Text style={styles.listTitle}>Cardapio da Semana</Text>
                
                {weekDates.map((dateStr, idx) => {
                    const isToday = dateStr === todayStr
                    const filteredMenus = menus.filter(m => m.date === dateStr)

                    return (
                        <View key={dateStr} style={[styles.dayRow, isToday && styles.rowToday]}>
                            <View style={[styles.dayHeader, isToday && styles.headerToday]}>
                                <Text style={[styles.dayName, isToday && { color: '#fff' }]}>
                                    {labelsDias[idx]} {isToday ? '(Hoje)' : ''}
                                </Text>
                            </View>

                            {filteredMenus.length > 0 ? (
                                filteredMenus.map(m => (
                                    <MenuCard
                                        key={m.id}
                                        menu={m}
                                        isFav={favorites.includes(m.id)}
                                        isServidor={user.type === 'servidor'}
                                        onToggleFavorite={() => handleToggleFavorite(m.id)}
                                        onCopy={() => onCopyAction(m)}
                                        onEdit={() => {
                                            setIsEditing(m)
                                            setMenuText(m.items.join('\n'))
                                        }}
                                        onDelete={() => removeMenu(m.id)}
                                    />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>Sem registros para hoje.</Text>
                            )}
                        </View>
                    )
                })}
            </ScrollView>

            <EditMenuModal
                visible={!!isEditing}
                itemsText={menuText}
                setItemsText={setMenuText}
                onClose={() => setIsEditing(null)}
                onSave={onSaveUpdate}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f3f4f6' },
    scrollPadding: { padding: 16, paddingBottom: 40 },
    userName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    roleTag: { color: '#dcfce7', fontSize: 11, marginTop: 2 },
    logoutText: { color: '#fff', fontWeight: '600' },
    navBar: {
        backgroundColor: '#15803d',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnBack: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: { color: '#fff', fontSize: 20 },
    favBox: {
        marginBottom: 25,
        backgroundColor: '#fef9c3',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fde047'
    },
    favLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#713f12',
        marginBottom: 10
    },
    listTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 15
    },
    dayRow: {
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 2
    },
    rowToday: { borderColor: '#15803d', borderWidth: 1.5 },
    dayHeader: { backgroundColor: '#f3f4f6', padding: 10 },
    headerToday: { backgroundColor: '#15803d' },
    dayName: { fontWeight: '600', color: '#374151' },
    emptyText: { padding: 15, color: '#9ca3af', textAlign: 'center', fontSize: 13 }
})