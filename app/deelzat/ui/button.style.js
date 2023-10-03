import {StyleSheet} from "react-native";

import Colors from "./../style/colors"

const _style = {
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 16
    },

    // btn
    btn_type_PRIMARY: {
        backgroundColor: Colors.MAIN_COLOR,
        borderColor:  Colors.MAIN_COLOR,
    },

    btn_type_PRIMARY_OUTLINE: {
        backgroundColor: 'transparent',
        borderColor:  Colors.MAIN_COLOR,
    },

    btn_type_SECONDARY: {
        backgroundColor: Colors.BLUEBERRY,
        borderColor:  Colors.BLUEBERRY,
    },

    btn_type_SECONDARY_OUTLINE: {
        backgroundColor: 'white',
        borderColor:  Colors.BLUEBERRY,
    },

    btn_type_MUTED: {
        backgroundColor: Colors.GREY,
        borderColor:  Colors.GREY,
    },

    btn_type_MUTED_OUTLINE: {
        backgroundColor: 'transparent',
        borderColor:  Colors.GREY,
    },

    btn_type_DANGER: {
        backgroundColor: Colors.ERROR_COLOR,
        borderColor:  Colors.ERROR_COLOR,
    },

    btn_type_DANGER_OUTLINE: {
        backgroundColor: 'transparent',
        borderColor:  Colors.ERROR_COLOR,

    },

    btn_type_MAUVE: {
        backgroundColor: Colors.BLUEBERRY,
        borderColor:  Colors.BLUEBERRY,
    },

    btn_type_MAUVE_OUTLINE: {
        backgroundColor: 'transparent',
        borderColor:  Colors.BLUEBERRY,
    },

    btn_type_BLUE: {
        backgroundColor: Colors.ACCENT_BLUE,
        borderColor:  Colors.ACCENT_BLUE,
    },

    btn_type_BLUE_OUTLINE: {
        backgroundColor: 'transparent',
        borderColor: Colors.CERULEAN_BLUE,
    },

    btn_type_ORANGY: {
        backgroundColor: Colors.ORANGE_PINK,
        borderColor:  Colors.ORANGE_PINK,
    },

    btn_type_BLACK: {
        backgroundColor: 'black',
        borderColor:  'black',
    },

    btn_size_LG: {
        height: 48
    },

    btn_size_MD: {
        height: 32
    },

    btn_size_SM: {
        height: 26
    },


    // text
    btn_text: {
        color: Colors.DARKER_GREY,
    },

    btn_text_type_PRIMARY: {
        color: "#fff"
    },

    btn_text_type_PRIMARY_OUTLINE: {
        color: Colors.MAIN_COLOR,
    },

    btn_text_type_SECONDARY: {
        color: "#fff"
    },

    btn_text_type_SECONDARY_OUTLINE: {
        color: Colors.BLUEBERRY,
    },


    btn_text_type_MUTED: {
        color: 'white',
    },

    btn_text_type_MUTED_OUTLINE: {
        color: Colors.DARKER_GREY,
    },

    btn_text_type_DANGER: {
        color: "#fff"
    },

    btn_text_type_DANGER_OUTLINE: {
        color: Colors.ERROR_COLOR
    },

    btn_text_type_MAUVE: {
        color: "#fff"
    },

    btn_text_type_MAUVE_OUTLINE: {
        color: Colors.BLUEBERRY
    },

    btn_text_type_BLUE: {
        color: "#fff"
    },

    btn_text_type_BLUE_OUTLINE: {
        color: Colors.CERULEAN_BLUE
    },

    btn_text_type_ORANGY: {
        color: "#fff"
    },

    btn_text_size_LG: {
        fontSize: 14
    },

    btn_text_size_MD: {
        fontSize: 12
    },

    btn_text_size_SM: {
        fontSize: 10
    },

    activityIndicator: {
        marginEnd: 10
    },

    disabled: {
        opacity: 0.6
    }
};


const style = StyleSheet.create(_style);
export { style as style };
