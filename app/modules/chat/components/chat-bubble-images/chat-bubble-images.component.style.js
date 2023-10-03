import { StyleSheet } from "react-native";

const style = {
    container: {
        flex: 1
    },
    image: {
        borderRadius: 10,
        margin: 3,
        resizeMode: 'cover',
        height: 100,
        minWidth: 100,
    },
    singleImageContainer: {
        width: 230,
        margin: 5,
        marginBottom: 8
    },
    multiImagesListContainer: {
        paddingHorizontal: 10
    },
    multiImagesColWrapper: {
        justifyContent: 'space-between'
    },
    multiImagesContainer: {
        width: 230,
        margin: 5,
        marginBottom: 8
    },
};

const chatBubbleImagesStyle = StyleSheet.create(style);
export { chatBubbleImagesStyle as chatBubbleImagesStyle };
