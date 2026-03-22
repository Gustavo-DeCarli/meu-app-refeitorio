import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { api } from '../../services/api';

export default function LoginScreen({ navigation }: any) {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
        try {
            const res = await api.post('/login', { login, password: senha });

            if (res.data.success) {
                navigation.replace('Home', { user: res.data.user });
            }
        } catch {
            Alert.alert('Erro', 'Login inválido');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput placeholder="Login" onChangeText={setLogin} />
            <TextInput placeholder="Senha" secureTextEntry onChangeText={setSenha} />

            <TouchableOpacity onPress={handleLogin}>
                <Text>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
}