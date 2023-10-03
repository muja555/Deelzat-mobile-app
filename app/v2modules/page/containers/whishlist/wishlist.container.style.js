import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";
import {isRTL} from "dz-I19n";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
    },
    cartBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1)
    },
    title: {
        flex: 1,
        fontSize: 18,
        color: Colors.N_BLACK,
        textAlign: 'center',
        ...Font.Bold
    },
    tabButtons: {
        width: '100%',
        flexDirection: 'row',
    },
    tabBtn: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBtnFocused: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    tabBtnText: {
        color: Colors.N_BLACK_50,
        fontSize: 14,
    },
    tabBtnTextFocused: {
        fontSize: 18,
        ...Font.Bold
    },
    pageContainer: {
        flex: 1,
        ...Spacing.HorizontalPadding
    },
    startBottomCorner: {
        position: 'absolute',
        left: 5,
        bottom: -1,
        transform: [{scaleX: isRTL()? 1.5: -1.5}, {scaleY: 1.1}],
    },
    endBottomCorner: {
        position: 'absolute',
        right: 5,
        bottom: -1,
        transform: [{scaleX: isRTL()? -1.5: 1.5}, {scaleY: 1.1}],
    },
    countBubble: {
        position: 'absolute',
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 20,
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingVertical: 2,
        height: 20,
        right: -8,
        top: -8,
    },
    countBubbleText: {
        fontSize: 10,
        color: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
    },
};

const wishlistContainerStyle = StyleSheet.create(style);
export { wishlistContainerStyle as savedContainerStyle };
