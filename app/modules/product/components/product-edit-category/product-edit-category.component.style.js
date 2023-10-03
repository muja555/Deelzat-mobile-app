import { StyleSheet } from "react-native";

const style = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },
    imagesView: {
        height: 100
    },
    mainCategoryView: {
        height: 100,
        marginHorizontal: -16,
    },
    previewImage: {
        width: '80%',
        height: '60%',
        borderRadius: 12
    }
};

const productEditCategoryStyle = StyleSheet.create(style);
export { productEditCategoryStyle as productEditCategoryStyle };
