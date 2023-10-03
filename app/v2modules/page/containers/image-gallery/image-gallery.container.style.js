import { StyleSheet } from "react-native";
import {Colors, Font, LayoutStyle} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderColor: Colors.alpha('#fff', 0.4),
        backgroundColor: Colors.alpha('#fff', 0.4),
    },
    indicator: {
        marginTop: 10,
        color: 'white',
        fontSize: 13,
        textAlign: 'center',
        ...Font.Bold
    },
    indicatorView: {
        position: 'absolute',
        height: 100,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBar: {
        height: 60,
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        top: 16,
        left: 24,
    },
    menuView: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        position: 'absolute',
        width: '100%',
        backgroundColor: 'white',
        bottom: 0,
        padding: 26,
        paddingBottom: 10,
        paddingTop: 24,
    }
};

const imageGalleryContainerStyle = StyleSheet.create(style);
export { imageGalleryContainerStyle as imageGalleryContainerStyle };
