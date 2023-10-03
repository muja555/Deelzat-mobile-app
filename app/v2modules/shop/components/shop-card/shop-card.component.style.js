import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        maxWidth: '48%',
        borderRadius: 12,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
        borderWidth: 1,
        overflow: 'hidden',
    },
    image: {
        height: 107,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
    },
    loaderIndicator: {
        marginTop: 30,
        height: 50,
    },
    shopName: {
        color: Colors.N_BLACK,
        fontSize: 14,
        textAlign: 'left',
        paddingHorizontal: 8,
        ...Font.Bold
    },
    stats: {
        paddingHorizontal: 8,
        textAlign: 'left',
        fontSize: 10,
        color: Colors.N_BLACK_50
    },
    number: {
        color: Colors.N_BLACK
    },
    followBtn: {
        height: 32,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderTopWidth: 1,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    followingBtn: {
        backgroundColor: Colors.MAIN_COLOR,
    },
    followText: {
        color: Colors.MAIN_COLOR,
        fontSize: 12,
    },
    followingText: {
        color: '#fff',
    }

};

const shopCardStyle = StyleSheet.create(style);
export { shopCardStyle as shopCardStyle };
