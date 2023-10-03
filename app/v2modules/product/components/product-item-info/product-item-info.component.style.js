import { StyleSheet } from "react-native";
import {Font} from "deelzat/style";

const style = {
    container: {

    },
    imageView: {
        width: '100%',
        height: 170,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',

    },
    price: {
        flex: 1,
        fontSize: 16,
        ...Font.Bold,

    }
};

const productItemInfoStyle = StyleSheet.create(style);
export { productItemInfoStyle as productItemInfoStyle };
