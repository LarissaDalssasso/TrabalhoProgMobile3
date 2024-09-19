import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, ScrollView, StyleSheet, Button, Alert, SafeAreaView, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import SyncStorage from 'sync-storage';

const PilhasTelas = createNativeStackNavigator();
const URL_API = 'https://jsonplaceholder.typicode.com/posts';
const URL_API_COMMENTS = 'https://jsonplaceholder.typicode.com/posts';

function TelaInicial({ navigation }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(URL_API)
            .then(resposta => resposta.json())
            .then(json => setPosts(json))
            .catch(() => Alert.alert("Erro ao carregar posts"));
    }, []);

    return (
        <SafeAreaView style={styles.containerScroow}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.texto2}>Posts</Text>
                    <View style={styles.botao}>
                        <Button
                            title="Ver Favoritos"
                            color="#436"
                            onPress={() => navigation.navigate("Favoritos")}
                        /></View>
                    {posts.map(pt => (
                        <View key={pt.id} style={styles.cardContainer}>
                            <View style={styles.texto}>
                                <Text>Título: {pt.title.replaceAll("\n"," ")}</Text>
                            </View>
                            <Button
                                title="Ver"
                                color="#436"
                                onPress={() => navigation.navigate("VisualizarPosts", { id: pt.id, title: pt.title, body: pt.body })}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function VisualizarPosts({ route }) {
    const [comentarios, setComentarios] = useState([]);
    useEffect(() => {
        fetch(`${URL_API_COMMENTS}/${route.params.id}/comments`)
            .then(resposta => resposta.json())
            .then(json => setComentarios(json)) // Obtendo o primeiro comentário da lista
            .catch((error) => {
                Alert.alert("Erro", "Não foi possível carregar os comentários")
                console.log(error.message);

            });
    }, [route.params.id ]);
    const favoritar = async () => {
        try {
            const favoritos = SyncStorage.get('favoritos') || [];

            const postFavorito = {
                        id: route.params.id,
                        title: route.params.title,
                        body: route.params.body
                    }
            const postFinded = favoritos.find( p => p.id === postFavorito.id )
            if (!postFinded) {
                
                favoritos.push(postFavorito);
                SyncStorage.set('favoritos', favoritos);
                Alert.alert("Post favoritado", "Este post foi adicionado aos favoritos!");
            } else {
                Alert.alert("Aviso", "Este post já está nos favoritos.");
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível favoritar o post.");
            console.log(error.message);
            
        }
    };
    return (
        <SafeAreaView style={styles.containerScroow}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.texto2}>{route.params.title.replaceAll("\n"," ")}</Text>
                    <View style={styles.textoComent}>
                        <Text>{route.params.body.replaceAll("\n"," ")}</Text>
                    </View>
                    <Button
                        title="Favoritar"
                        color="#436"
                        onPress={favoritar}
                    />
                    <Text style={styles.texto2}>Comentários</Text>
                    {comentarios.map(pt => (
                        <View key={pt.id} style={styles.cardContainer}>
                            <View style={styles.textoDetalhe2}>
                                <Text>Nome: {pt.name}</Text>
                                <Text>Email: {pt.email}</Text>
                                <Text>Comentário: {pt.body.replaceAll("\n"," ")}</Text>
                            </View>
                        </View>
                    ))}
                    </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function Favoritos({ navigation }) {
    const [postsFavoritos, setPostsFavoritos] = useState([]);
    useEffect(() => {
        const carregarFavoritos = async () => {
            try {
                const favs = SyncStorage.get('favoritos') || [];
                console.log(favs);
                // const promises = favs.map(id => fetch(`${URL_API}/${id}`).then(res => res.json()));
                // const resultados = await Promise.all(promises);
                setPostsFavoritos(favs);
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar os posts favoritos.");
                console.log(error.message);
                
            }
        };
        carregarFavoritos();
    }, []);

    return (
        <SafeAreaView style={styles.containerScroow}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.texto2}>Posts Favoritos</Text>
                    {postsFavoritos.map(post => (
                        <View key={post.id} style={styles.cardContainer}>
                            <View style={styles.textoDetalhe}>
                                <Text>Título: {post.title}</Text>
                            </View>
                            <View style={styles.botao}>
                                <Button
                                    title="Ver Detalhes"
                                    color="#436"
                                    onPress={() => navigation.navigate("VisualizarPosts", { id: post.id, title: post.title, body: post.body })}
                                /></View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
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
                    name="VisualizarPosts"
                    component={VisualizarPosts}
                    options={{ title: "Visualizar Posts" }}
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
    containerScroow: {
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",

    },
    cardContainer: {
        width: "95%",
        borderWidth: 1,
        borderColor: "#d5d5d5",
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 7,
        padding: 7,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    scrollView: {
        margin: 2,
    },
    texto: {
        width: '85%'
    },
    botao: {
        margin: 8
    },
    texto2: {
        textAlign:'center',
        margin:20,
        fontSize: 20,
    },
    textoDetalhe: {
        width: '65%'
    },
    textoDetalhe2: {
        width: '98%'
    },
    textoComent: {
        width: '90%',
        padding: 5
    },
    textos: {
        padding: 7
    }
});
