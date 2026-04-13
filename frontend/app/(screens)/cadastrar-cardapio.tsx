import { Redirect, useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { api } from '../(services)/api';
import { useUser } from '../../contexts/UserContext';

type MealType = 'Café da Manhã' | 'Almoço' | 'Jantar';

export default function CadastrarCardapio() {
    const router = useRouter();
    const { user } = useUser();

        if (!user) {
            return <Redirect href='/login'></Redirect>;
        }
    
    const [text, setText] = useState('');
    const [mealType, setMealType] = useState<MealType>('Almoço');

    const hoje = new Date();
    const [day, setDay] = useState(String(hoje.getDate()).padStart(2, '0'));
    const [month, setMonth] = useState(String(hoje.getMonth() + 1).padStart(2, '0'));
    const [year, setYear] = useState(String(hoje.getFullYear()));

    const salvar = async () => {
        const d = day.padStart(2, '0');
        const m = month.padStart(2, '0');
        const y = year;

        const dataFormatada = `${y}-${m}-${d}`;

        const diaNum = parseInt(d);
        const mesNum = parseInt(m);

        if (diaNum <= 0 || diaNum > 31 || mesNum <= 0 || mesNum > 12 || y.length < 4) {
            Alert.alert('Erro', 'Informe uma data válida (DD/MM/AAAA)');
            return;
        }

        const items = text
            .split('\n')
            .map(i => i.trim())
            .filter(i => i.length > 0);

        if (items.length === 0) {
            Alert.alert('Erro', 'Informe pelo menos um item no cardápio');
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
            console.error('ERRO API:', e?.response?.data || e.message);
            Alert.alert('Erro', 'Falha ao salvar. Verifique a conexão com o servidor.');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Novo Cardápio</Text>

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

            <TouchableOpacity style={styles.button} onPress={salvar}>
                <Text style={styles.buttonText}>Salvar Cardápio</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
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
        backgroundColor: '#f9fafb'
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
        backgroundColor: '#f9fafb'
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
        backgroundColor: '#f9fafb'
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
    }
});