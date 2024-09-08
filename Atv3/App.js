import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, ScrollView, StyleSheet, Button, Alert } from "react-native";
import { useState, useEffect } from "react";

const PilhasTelas = createNativeStackNavigator();
const URL_API = 'https://jsonplaceholder.typicode.com/posts';
const URL_API_COMMENTS = 'https://jsonplaceholder.typicode.com/posts';

function TelaInicial({ navigation }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(URL_API)
            .then(resposta => resposta.json())
            .then(json => setUsers(json))
            .catch(() => Alert.alert("Erro ao carregar usuários"));
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>Usuários</Text>
                {users.map(us => (
                    <View key={us.id} style={styles.cardContainer}>
                        <View>
                            <Text>Título: {us.title}</Text>
                        </View>
                        <Button
                            title="Ver"
                            color="#436"
                            onPress={() => navigation.navigate("VisualizarUsuario", { id: us.id })}
                        />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

function VisualizarUsuario({ route }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        fetch(`${URL_API_COMMENTS}/${route.params.id}/comments`)
            .then(resposta => resposta.json())
            .then(json => setUser(json[0])) // Obtendo o primeiro comentário da lista
            .catch(() => Alert.alert("Erro", "Não foi possível carregar os comentários"));
    }, [route.params.id]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>Nome: {user?.name}</Text>
                <Text>Email: {user?.email}</Text>
                <Text>Comentário: {user?.body}</Text>
            </View>
        </ScrollView>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <PilhasTelas.Navigator>
                <PilhasTelas.Screen
                    name="TelaInicial"
                    component={TelaInicial}
                    options={{ title: "Tela Inicial" }}
                />
                <PilhasTelas.Screen
                    name="VisualizarUsuario"
                    component={VisualizarUsuario}
                    options={{ title: "Visualizar Usuário" }}
                />
            </PilhasTelas.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    cardContainer: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#d5d5d5",
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 20,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
