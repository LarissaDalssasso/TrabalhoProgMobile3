import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, ScrollView, StyleSheet, Button, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para salvar favoritos


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
                   <Button
                    title="Ver Favoritos"
                    color="#436"
                    onPress={() => navigation.navigate("Favoritos")}
                />
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


    const favoritar = async () => {
        try {
            const favoritos = JSON.parse(await AsyncStorage.getItem('favoritos')) || [];
            if (!favoritos.includes(route.params.id)) {
                favoritos.push(route.params.id);
                await AsyncStorage.setItem('favoritos', JSON.stringify(favoritos));
                Alert.alert("Post favoritado", "Este post foi adicionado aos favoritos!");
            } else {
                Alert.alert("Aviso", "Este post já está nos favoritos.");
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível favoritar o post.");
        }
    };


    return (
        <ScrollView>
            <View>
                <View style={styles.container}>
                    <Text>Nome: {user?.name}</Text>
                    <Text>Email: {user?.email}</Text>
                    <Text>Comentário: {user?.body}</Text>
                </View>

                <Button
                    title="Favoritar"
                    color="#436"
                    onPress={favoritar}
                /></View>
        </ScrollView>
    );
}

function Favoritos({ navigation }) {
    const [favoritos, setFavoritos] = useState([]);
    const [postsFavoritos, setPostsFavoritos] = useState([]);

    useEffect(() => {
        const carregarFavoritos = async () => {
            try {
                const favs = JSON.parse(await AsyncStorage.getItem('favoritos')) || [];
                setFavoritos(favs);

                // Buscar os detalhes dos posts favoritados
                const promises = favs.map(id => fetch(`${URL_API}/${id}`).then(res => res.json()));
                const resultados = await Promise.all(promises);
                setPostsFavoritos(resultados);
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar os posts favoritos.");
            }
        };

        carregarFavoritos();
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>Posts Favoritos</Text>
                {postsFavoritos.map(post => (
                    <View key={post.id} style={styles.cardContainer}>
                        <Text>{post.title}</Text>
                        <Button
                            title="Ver Detalhes"
                            color="#436"
                            onPress={() => navigation.navigate("VisualizarUsuario", { id: post.id })}
                        />
                    </View>
                ))}
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
                <PilhasTelas.Screen
                    name="Favoritos"
                    component={Favoritos}
                    options={{ title: "Favoritos" }}
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
