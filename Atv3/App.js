import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, ScrollView, StyleSheet, Button } from "react-native"
import { useState } from "react";
import { useEffect } from "react";

const PilhasTelas = createNativeStackNavigator()
const URL_API = 'https://jsonplaceholder.typicode.com/posts'
const URL_API2 = 'https://jsonplaceholder.typicode.com/posts/id/comments'
function TelaInicial({ route, navigation }) {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch(URL_API).then(resposta => resposta.json())
            .then(json => { setUsers(json) })
            .catch(() => { Alert.alert("Erro ao carregar usuários") })
    })
    useEffect(() => {
        fetch(URL_API2).then(resposta => resposta.json())
            .then(json => { setUsers(json) })
            .catch(() => { Alert.alert("Erro ao carregar usuários") })
    })
    //serve para enviar uma requisição
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>Usuários</Text>
                {users.map(us => (
                    <View key={us.id} style={styles.cardContainer}>
                        <View>
                            <Text>Título: {us.title}</Text>
                        </View>
                        <Button title="Ver" color="#436" onPress={() => { navigation.navigate("VisualizarUsuario", { 'id': us.id, 'title': us.title }) }}></Button>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}
function VisualizarUsuario({ route, navigation }) {

    const [user, setUser] = useState({})
    useEffect(() => {//requisicao
        fetch(`${URL_API}/${route.params.id}`)
            .then(response => response.json())
            .then(json => { setUser(json) })
            .catch(() => { Alert.alert("Erro", "Não foi possível carregar página") })
    }, [route.params.id])

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>Id:{route.params.id}</Text>
                <Text>Nome: {user.name}</Text>
                <Text>Email: {user.email}</Text>
                <Text>Comentário: {user.body}</Text>
                
            </View>
        </ScrollView>
    )
}

export default function App() {
    return (
        <NavigationContainer>
            <PilhasTelas.Navigator>
                <PilhasTelas.Screen
                    name="TelaInicial"
                    component={TelaInicial}
                    options={{ title: "Tela Inicial" }}
                ></PilhasTelas.Screen>
                <PilhasTelas.Screen
                    name="VisualizarUsuario"
                    component={VisualizarUsuario}
                    options={{ title: "Visualizar Usuário" }}
                ></PilhasTelas.Screen>
            </PilhasTelas.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
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
        justifyContent: "space-between"
    }
})