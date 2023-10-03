import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    headerButton: {
        position: 'absolute',
        right: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    selectedValuesView: {
        backgroundColor: Colors.CERULEAN_BLUE,
        borderRadius: 20,
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginEnd: 20,
        height: 20,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    selectedValuesCount: {
        color: 'white',
        fontSize: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        ...Font.Bold,
    },
    openIcon: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    }
};

const panelStyle = StyleSheet.create(style);
export { panelStyle as panelStyle };
