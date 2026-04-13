import { Redirect, useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { api } from '../../services/api';
import { useUser } from '../../contexts/UserContext';

type MealType = 'Café da Manhã' | 'Almoço' | 'Jantar';

export default function CadastrarCardapio() {
    const router = useRouter();
    const { user, setUser } = useUser();

    if (!user) {
        return <Redirect href='/login'></Redirect>;
    }

    const [text, setText] = useState('');
    const [mealType, setMealType] = useState<MealType>('Almoço');

    const hoje = new Date();
    const [day, setDay] = useState(String(hoje.getDate()).padStart(2, '0'));
    const [month, setMonth] = useState(String(hoje.getMonth() + 1).padStart(2, '0'));
    const [year, setYear] = useState(String(hoje.getFullYear()));
    const [error, setError] = useState('');

    const handleLogout = () => {
        setUser(null);
        router.replace('/login');
    };

    const salvar = async () => {
        setError('');
        const d = day.padStart(2, '0');
        const m = month.padStart(2, '0');
        const y = year;

        const dataFormatada = `${y}-${m}-${d}`;

        const diaNum = parseInt(d);
        const mesNum = parseInt(m);

        if (diaNum <= 0 || diaNum > 31 || mesNum <= 0 || mesNum > 12 || y.length < 4) {
            setError('Informe uma data válida (DD/MM/AAAA)');
            return;
        }

        const items = text
            .split('\n')
            .map(i => i.trim())
            .filter(i => i.length > 0);

        if (items.length === 0) {
            setError('Informe pelo menos um item no cardápio');
            return;
        }

        try {
            await api.post('/menus', {
                date: dataFormatada,
                meal_type: mealType,
                items: items
            });

            Alert.alert('Sucesso', 'Cardápio cadastrado com sucesso!');
            router.back();
        } catch (e: any) {
            const msg = e?.response?.data?.error || 'Falha ao salvar. Verifique a conexão com o servidor.';
            setError(msg);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>

                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.welcome}>Olá, {user?.name}</Text>
                    <Text style={styles.badge}>
                        Acesso: {user?.type.toUpperCase()}
                    </Text>
                </View>

                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logout}>Sair</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

            <Text style={styles.label}>Data da Refeição:</Text>
            <View style={styles.dateContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.miniLabel}>Dia</Text>
                    <TextInput
                        style={styles.dateInput}
                        placeholder="DD"
                        keyboardType="numeric"
                        maxLength={2}
                        value={day}
                        onChangeText={setDay}
                        selectTextOnFocus
                    />
                </View>
                <Text style={styles.dateSeparator}>/</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.miniLabel}>Mês</Text>
                    <TextInput
                        style={styles.dateInput}
                        placeholder="MM"
                        keyboardType="numeric"
                        maxLength={2}
                        value={month}
                        onChangeText={setMonth}
                        selectTextOnFocus
                    />
                </View>
                <Text style={styles.dateSeparator}>/</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.miniLabel}>Ano</Text>
                    <TextInput
                        style={[styles.dateInput, { width: 80 }]}
                        placeholder="AAAA"
                        keyboardType="numeric"
                        maxLength={4}
                        value={year}
                        onChangeText={setYear}
                        selectTextOnFocus
                    />
                </View>
            </View>

            <Text style={styles.label}>Tipo de Refeição:</Text>
            <View style={styles.row}>
                {(['Café da Manhã', 'Almoço', 'Jantar'] as MealType[]).map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.typeButton, 
                            mealType === type && styles.typeButtonActive
                        ]}
                        onPress={() => setMealType(type)}
                    >
                        <Text style={[
                            styles.typeText, 
                            mealType === type && { color: '#fff' }
                        ]}>
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Itens do Cardápio (um por linha):</Text>
            <TextInput
                placeholder="Ex: Arroz Branco&#10;Feijão Carioca&#10;Frango Grelhado"
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={6}
                style={styles.input}
            />

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={salvar}>
                <Text style={styles.buttonText}>Salvar Cardápio</Text>
            </TouchableOpacity>
            </ScrollView>
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
    badge: { color: '#dcfce7', fontSize: 12, marginTop: 4 },
    logout: { color: '#fff', fontWeight: 'bold' },
    scrollContent: {
        padding: 20,
        paddingBottom: 40
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 25, 
        color: '#15803d',
        textAlign: 'center' 
    },
    label: { 
        fontSize: 15, 
        fontWeight: '700', 
        marginBottom: 10, 
        color: '#374151' 
    },
    miniLabel: {
        fontSize: 10,
        color: '#9ca3af',
        textAlign: 'center',
        marginBottom: 2
    },
    inputGroup: {
        alignItems: 'center'
    },
    dateContainer: { 
        flexDirection: 'row', 
        alignItems: 'flex-end', 
        marginBottom: 25,
        gap: 8 
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        textAlign: 'center',
        width: 55,
        fontSize: 16,
        backgroundColor: '#fff'
    },
    dateSeparator: { 
        fontSize: 20, 
        color: '#9ca3af', 
        paddingBottom: 10 
    },
    row: { 
        flexDirection: 'row', 
        gap: 8, 
        marginBottom: 25 
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    typeButtonActive: { 
        backgroundColor: '#15803d', 
        borderColor: '#15803d' 
    },
    typeText: { 
        fontSize: 11, 
        color: '#4b5563', 
        fontWeight: 'bold' 
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        height: 150,
        textAlignVertical: 'top',
        marginBottom: 30,
        fontSize: 16,
        backgroundColor: '#fff'
    },
    button: { 
        backgroundColor: '#15803d', 
        padding: 18, 
        borderRadius: 10, 
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500'
    }
});
