import { StyleSheet } from "react-native";

const style = {
    container: {
        width: '105%',
        height: '105%',
        paddingStart: '2.5%',
        zIndex: 10000000000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigImage: {
        width: '103%',
        height: '100%',
        position: 'absolute'
    }
};

const welcomeMarketStyle = StyleSheet.create(style);
export { welcomeMarketStyle as welcomeMarketStyle };
