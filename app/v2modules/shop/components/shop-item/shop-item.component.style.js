import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const borderWidth = 0.2;
const borderRadius = 12;

const style = {
    container: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
    },
    info: {
        padding: 12,
        borderLeftColor: Colors.Gray400,
        borderLeftWidth: borderWidth,
        borderRightColor: Colors.Gray400,
        borderRightWidth: borderWidth,
    },
    name: {
        fontSize: 14,
        ...Font.Bold,
    },
    count: {
        fontSize: 10,
        ...Font.Bold,
    },
    label: {
        fontSize: 10,
        color: Colors.Gray700
    },
    followBtn: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: borderWidth,
        borderColor: Colors.Gray400,
        overflow: 'hidden',
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
    },
    followingView: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: borderWidth,
        borderColor: Colors.MAIN_COLOR,
        backgroundColor: Colors.MAIN_COLOR,
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
    }
};

const shopItemStyle = StyleSheet.create(style);
export { shopItemStyle as shopItemStyle };
