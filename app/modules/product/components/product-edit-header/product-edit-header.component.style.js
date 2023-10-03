import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        height: 55,
    },
    head: {
        flexDirection: 'row',
        height: 50
    },
    btnView: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 16,
        ...Font.Bold
    },
    progressBarView: {
        flex: 1,

        marginHorizontal: 10,
        borderRadius: 5,
        backgroundColor: Colors.LIGHT_GREY
    },
    progressBar: {
        borderRadius: 5,
        backgroundColor: Colors.MAIN_COLOR,
        width: 0,
        height: '100%'
    }
};

const productEditHeaderStyle = StyleSheet.create(style);
export { productEditHeaderStyle as productEditHeaderStyle };
