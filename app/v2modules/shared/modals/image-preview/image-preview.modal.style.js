import { StyleSheet } from "react-native";

const style = {
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
    },
    previewImage: {
        width: '80%',
        height: '60%',
        borderRadius: 12
    },
};

const imagePreviewModalStyle = StyleSheet.create(style);
export { imagePreviewModalStyle as imagePreviewModalStyle };
