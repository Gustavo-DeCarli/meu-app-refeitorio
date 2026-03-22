import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    View, TextInput, TouchableOpacity, Text, Alert, StyleSheet
} from 'react-native';
import { api } from '../services/api';

export default function Index() {
    const router = useRouter();

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
        try {
            const res = await api.post('/login', {
                login,
                password: senha
            });

            if (res.data.success) {
                router.replace({
                    pathname: '/home',
                    params: { user: JSON.stringify(res.data.user) }
                });
            }
        } catch {
            Alert.alert('Erro', 'Login inválido');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Portal IFRS</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Login"
                    value={login}
                    onChangeText={setLogin}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f3f4f6'
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: 14,
        borderRadius: 10,
        marginBottom: 16
    },
    button: {
        backgroundColor: '#15803d',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});