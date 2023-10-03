import { StyleSheet } from "react-native";
import Colors from "deelzat/style/colors";

const style = {
    container: {
        backgroundColor: Colors.SPLASH,
        width: '100%',
        height: '102%',
        zIndex: 100000000,
        alignItems: 'center',
        justifyContent: 'center',
    },
};

const bigSplashOverlayStyle = StyleSheet.create(style);
export { bigSplashOverlayStyle as bigSplashOverlayStyle };
