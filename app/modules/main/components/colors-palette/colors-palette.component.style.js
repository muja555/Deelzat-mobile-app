import { StyleSheet } from "react-native";
import DoneOutlineSvg from "../../../../../assets/icons/DoneOutline.svg";
import React from "react";

const style = {
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorView: {
        margin: 5,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    color: {
        width: 50,
        height: 50,
        borderRadius: 25,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.1,
        elevation: 2,
        shadowRadius: 1.0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    check: {
        width: 20,
        height: 20,
    }
};

const colorsPaletteStyle = StyleSheet.create(style);
export { colorsPaletteStyle as colorsPaletteStyle };
