import {StyleSheet} from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 500,
        width: '100%'
    },
    colorsView: {
      paddingHorizontal: 16,
        flex: 1
    },
    head: {
        width: '100%',
        paddingHorizontal: 16
    },
    doneView: {
        width: 40,
        height: 50,
        alignItems:'center',
        justifyContent: 'center'
    },
    doneText: {
        color: Colors.ACCENT_BLUE,
        ...Font.Bold
    }
};

const colorSelectorModalStyle = StyleSheet.create(style);
export { colorSelectorModalStyle as colorSelectorModalStyle };
