import { StyleSheet } from "react-native";
import {isRTL} from "dz-I19n";

const style = {
    container: {
        alignItems: 'center',
        width: 80,
        position: 'relative'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 5
    },
    titleView: {
        textAlign: 'center'
    },
    checkView: {
        zIndex: 1,
        [isRTL()? 'left': 'right']: '20%',
        position: 'absolute',
        width: 15,
        height: 15,
        borderRadius: 20,
        backgroundColor: 'white'
    }
};

const productCategoryItemStyle = StyleSheet.create(style);
export { productCategoryItemStyle as productCategoryItemStyle };
