import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from "react-native";
import { CategoryProps } from "../../pages/Order";

interface ModalPickerProps{
    options: CategoryProps[];
    handleModalClose: () => void;
    selectedItem: (item: CategoryProps) => void;
}

const {width: WIDTH, height: HEIGHT} = Dimensions.get('window')

export function ModalPicker({options, handleModalClose, selectedItem}: ModalPickerProps){
    
    function onPressItem(item: CategoryProps){
        selectedItem(item)
        handleModalClose()
    }
    
    const option = options.map((item, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={() => onPressItem(item)}>
            <Text style={styles.item}>
                {item?.name}
            </Text>
        </TouchableOpacity>
    ))
    
    return(
        <TouchableOpacity style={styles.container} onPress={handleModalClose}>
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    content:{
        width: WIDTH - 20,
        height: HEIGHT / 2,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#8A8A8A",
        borderRadius: 4
    },
    option:{
        alignItems:"flex-start",
        borderTopWidth: 0.8,
        borderTopColor: "#8A8A8A"
    },
    item:{
        margin: 18,
        fontSize: 14,
        fontWeight: "bold",
        color: "#101026"
    }
})