import { StyleSheet } from "react-native";

const style = {
    container: {
        flex: 1
    },
    banner: {
        position: 'absolute',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerText: {
        color: '#fff',
        fontSize: 12,
    }
};

const networkStatusStyle = StyleSheet.create(style);
export { networkStatusStyle as networkStatusStyle };
