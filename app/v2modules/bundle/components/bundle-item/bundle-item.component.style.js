import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {

    },
    shopName: {
        flexWrap: 'wrap',
        fontSize: 14,
        color: Colors.LINK,
        ...Font.Bold
    },
    shopImage: {
        width: 36,
        height: 36,
        borderRadius: 36
    },
    shopNameAndImage: {
        flex: 0.75,
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        flex: 0.90,
        fontSize: 14,
        color: Colors.N_BLACK,
      ...Font.Bold
    },
    followBtn: {
        height: 24,
        width: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        borderColor: Colors.MAIN_COLOR,
        borderWidth: 1,
    },
    followBtnText: {
        color: Colors.MAIN_COLOR,
        fontSize: 12,
    },
    followBtnLoading: {

    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.12,
        shadowRadius: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        elevation: 3.5,
    },
    description: {
        fontSize: 12,
        color: Colors.N_BLACK,
    }
};

const bundleItemStyle = StyleSheet.create(style);
export { bundleItemStyle as bundleItemStyle };
