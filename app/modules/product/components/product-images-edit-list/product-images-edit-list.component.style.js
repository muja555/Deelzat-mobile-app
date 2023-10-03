import { StyleSheet } from "react-native";
import { Colors } from "deelzat/style";

const style = {
    container: {
        flex: 1,
    },
    imageWrapper: {
        marginStart: 5
    },
    failedImage: {
        borderColor: Colors.ERROR_COLOR,
    },
    image: {
        borderRadius: 10,
        borderColor: '#000',
        height: 80,
        width: 80,
        marginStart: 5,
        borderWidth: 2
    },
    mainImage: {
        borderColor: Colors.MAIN_COLOR,
    }
};

const productImagesEditListStyle = StyleSheet.create(style);
export { productImagesEditListStyle as productImagesEditListStyle };
