import { StyleSheet } from "react-native";

const style = {
    container: {
        flex: 1,
        minWidth: 100,
    },
    imageActive: {
        flex: 1,
        resizeMode: 'contain',
    },
    closeBtnContainer: {
        width: 100,
        paddingTop: 20,
        height: 60,
        paddingStart: 24,
        paddingEnd: 24,
    },
    image: {
        borderRadius: 10,
        margin: 3,
        resizeMode: 'cover',
        height: 100,
        minWidth: 100,
    }
};

const chatBubbleImagesItemStyle = StyleSheet.create(style);
export { chatBubbleImagesItemStyle as chatBubbleImagesItemStyle };
