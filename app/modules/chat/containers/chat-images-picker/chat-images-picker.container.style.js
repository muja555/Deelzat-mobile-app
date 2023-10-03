import { StyleSheet } from "react-native";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        overflow: 'hidden',
        flex: 1,
    },
    actionsView: {
        height: 120,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    takePhotoBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    openGalleryBtn: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    openGalleryIconView: {
        backgroundColor: "#fff",
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagesView: {
        height: 100,
        paddingEnd: 16,
    }
};

const chatImagesPickerContainerStyle = StyleSheet.create(style);
export { chatImagesPickerContainerStyle as chatImagesPickerContainerStyle };
