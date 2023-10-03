import { StyleSheet } from "react-native";
import React from "react";
import {Colors} from "deelzat/style";

const style = {
    container: {
        borderRadius: 20,
        backgroundColor: Colors.N_GREY,
        paddingVertical: 3,
        paddingHorizontal: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorView: {
        margin: 3,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorViewSelected: {
        borderWidth: 3,
        borderRadius: 25,
        borderColor: '#000'
    },
    color: {
        width: 16,
        height: 16,
        borderRadius: 25,
    },
};

const colorsPaletteStyle = StyleSheet.create(style);
export { colorsPaletteStyle as colorsPaletteStyle };
