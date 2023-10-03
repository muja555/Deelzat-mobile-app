import { StyleSheet } from "react-native";
import { Colors } from "deelzat/style";

const style = {
    container: {
        flex: 1,
        padding: 16,
    },
    colorTitleView: {
        flexDirection: 'row'
    },
    selectedView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    moreColorsLink: {
        color: Colors.ACCENT_BLUE
    },
    selectedColorThumb: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginStart: 2
    },
    noOptionsMessage: {
        color: Colors.GREY,
        textAlign: 'center',
        padding: 32
    }
};

const productEditVariantsStyle = StyleSheet.create(style);
export { productEditVariantsStyle as productEditVariantsStyle };
