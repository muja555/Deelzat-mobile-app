import {Platform, StyleSheet} from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
    },
    innerContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingBottom: 16,
        height: 56,
        backgroundColor: 'white',
    },
    item: {
        flex: 1
    },
    button: {
        flex: 1,
        alignItems: "center"
    },
    iconView: {
       flex: 1,
        justifyContent: 'flex-end'

    },
    stripe: {
        width: 24,
        height: 4,
        backgroundColor: Colors.MAIN_COLOR,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    stagingIndicator: {
        left: 0,
        bottom: 0,
        width: 10,
        height: 50,
        position: 'absolute',
        backgroundColor: 'red',
    },
    tabCircle: {
        width: 22,
        height: 22,
        top: Platform.OS === 'ios'? 12: 8,
        right: Platform.OS === 'ios'? '20%': '15%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: Colors.ORANGE_PINK,
        borderRadius: 10
    },
    counter: {
        color: 'white',
        fontSize: 10,
        ...Font.Bold
    }
};

const mainTabBarStyle = StyleSheet.create(style);
export { mainTabBarStyle as mainTabBarStyle };
