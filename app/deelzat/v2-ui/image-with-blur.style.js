import { StyleSheet } from "react-native";

const _style = {
    container: {
        overflow: "hidden",
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    blurView: {
        width: '100%',
        height: '100%',
    },
    imageStyle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    activityIndicator: {
        width: '100%',
        height: '100%',
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const style = StyleSheet.create(_style);
export { style as style };
