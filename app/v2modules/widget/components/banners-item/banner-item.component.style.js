import {Platform, StyleSheet} from "react-native";
import {Font} from "deelzat/style";

const style = {
    container: {
        width: '100%',
        flex: 1,
    },
    imageContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    },
    buttonText: {
        position: 'absolute',
        left: 24,
        bottom: 14,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minWidth: 119,
        height: 48,
        paddingTop: 12,
        overflow: 'hidden',
        fontSize: 14,
        borderRadius: 12,
        paddingStart: 17,
        paddingEnd: 17,
        ...Font.Bold,
    },
};

const bannerItemStyle = StyleSheet.create(style);
export { bannerItemStyle as bannerItemStyle };
