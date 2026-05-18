import { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { api } from "../../services/api";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { setUser } = useUser();
    const router = useRouter();

    const handleLogin = async () => {
        setError("");
        if (!login || !senha) {
            setError("Preencha todos os campos");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/login", {
                login,
                password: senha,
            });

            if (res.data?.success && res.data.user) {
                setUser(res.data.user);
                router.replace("/home");
            } else {
                setError("Usuário ou senha incorretos");
            }
        } catch (err) {
            setError("Credenciais inválidas");
        } finally {
            setLoading(false);
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
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f3f4f6",
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24,
        color: "#15803d",
    },
    input: {
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#d1d5db",
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#15803d",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    errorText: {
        color: "#ef4444",
        fontSize: 14,
        textAlign: "center",
        marginTop: 15,
        fontWeight: "500",
    },
});
