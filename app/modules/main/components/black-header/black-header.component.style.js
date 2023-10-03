import {StyleSheet} from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    header: {
        height: 60,
        backgroundColor: '#000',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    btnWrapper: {
        minWidth: 60,
        padding: 5,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        height: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnHero: {
        backgroundColor: Colors.MAIN_COLOR,
        width: '100%',
        height: 40,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    btnText: {
        color: '#fff'
    },
    titleWrapper: {
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        color: '#fff',
        fontSize: 18,
        ...Font.Bold
    }
};

const blackHeaderStyle = StyleSheet.create(style);
export { blackHeaderStyle as blackHeaderStyle };
