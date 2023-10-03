import {StyleSheet} from "react-native";
import {Colors} from "deelzat/style";

const style = {
    container: {
        padding: 16,
        paddingBottom: 0,
        alignItems: 'center',
    },
    appVersion: {
        color: Colors.GREY,
    },
    appVersionStaging: {
        color: Colors.ORANGE_PINK,
    }
};

const appVersionStyle = StyleSheet.create(style);
export { appVersionStyle as appVersionStyle };
