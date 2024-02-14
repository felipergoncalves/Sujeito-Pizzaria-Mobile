import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {Feather} from '@expo/vector-icons'
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type RouteDetailParams = {
    FinishOrder: {
        number: string | number;
        order_id: string;
    }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>

export function FinishOrder(){

    const route = useRoute<FinishOrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>()

    async function handleFinsih(){
        try{
            await api.put("/order/send", {
                order_id: route.params?.order_id
            })
            navigation.popToTop();
        }catch(err){
            console.log("Erro ao finalizar: " + err)
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.alert}>Deseja finalizar esse pedido?</Text>
            <Text style={styles.title}>Mesa: {route.params?.number}</Text>

            <TouchableOpacity style={styles.button} onPress={handleFinsih}>
                <Text style={styles.textButton}>Finalizar pedido</Text>
                <Feather name="shopping-cart" size={20} color="#1D1D2E"/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#1D1D2E",
        paddingVertical: "5%",
        paddingHorizontal: "4%",
        alignItems: "center",
        justifyContent: "center"
    },
    alert:{
        fontSize: 20,
        color: "#FFF",
        fontWeight: "bold",
        marginBottom: 12,
    },
    title:{
        fontSize: 30,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 12,
    },
    button:{
        backgroundColor: "#3FFFA3",
        flexDirection: "row",
        width: "65%",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },
    textButton:{
        fontSize: 18,
        marginRight: 8,
        fontWeight: "bold",
        color: "#1D1D2E"
    }
})