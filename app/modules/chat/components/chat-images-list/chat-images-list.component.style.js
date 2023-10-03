import { StyleSheet } from "react-native";
import { Colors } from "deelzat/style";

const style = {
    container: {
        flex: 1,
    },
    imageWrapper: {
        marginStart: 5,
    },
    image: {
        borderRadius: 5,
        borderColor: '#000',
        height: 70,
        width: 70,
        marginStart: 5,
        borderWidth: 1,
        marginBottom: 10,
    },
    list: {
        flexGrow: 1,
        paddingTop: 10
    },
    deleteIcon: {
        position: 'absolute',
        right: -7,
        top: -7
    },
    progressCircle: {
        opacity: 0.6,
        position: 'absolute',
        right: 13,
        top: 13,
    },
    errorIcon: {
        opacity: 0.8,
        position: 'absolute',
        right: 22,
        top: 22,
    }
};


const chatImagesListStyle = StyleSheet.create(style);
export { chatImagesListStyle as chatImagesListStyle };
