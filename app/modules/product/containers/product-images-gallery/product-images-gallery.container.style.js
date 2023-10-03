import { StyleSheet } from "react-native";
import {Font} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    indicator: {
        marginTop: 10,
        width: '100%',
        color: 'white',
        fontSize: 13,
        textAlign: 'center',
        ...Font.Bold
    },
    backBtn: {
        height: 40,
        marginStart: 16,
    },
    actionBar: {
        height: 60,
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        top: 12,
        left: 0,
    }
};

const productImagesGalleryContainerStyle = StyleSheet.create(style);
export { productImagesGalleryContainerStyle as productImageGalleryContainerStyle };
