import {Platform, StyleSheet} from "react-native";
import {Font} from "deelzat/style";

const style = {
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 16
    },
    title: {
      textAlign: "center",
        fontSize: 16,
        ...Font.Bold
    },
    section: {
      flexDirection: "row"
    },
    sectionTitle: {
      flex: 1,
        textAlign: 'left',
        ...Font.Bold
    },
    images: {
        paddingStart: 25,
      flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    imageView: {
      marginEnd: 4,
        marginBottom: 4
    },
    imageUploadStatus: {
        width: 50,
        height: 50,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.4)',
        position: 'absolute',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 4
    },
    successSection: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    successTitle: {
        color: '#000',
        fontSize: 18,
        textAlign: 'center',
        ...Font.Bold
    },
    successIcon: {
        fontSize: 58
    },
    exitView: {
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        bottom: 16,
    }
};

const productSubmitStyle = StyleSheet.create(style);
export { productSubmitStyle as productSubmitStyle };
