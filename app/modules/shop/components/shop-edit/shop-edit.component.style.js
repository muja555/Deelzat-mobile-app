import React from 'react';
import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 5,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderRadius: 8
    },
    head: {
        flexDirection: 'row',
        height: 50
    },
    closeBtn: {
        width: 100,
        paddingTop: 20,
        height: 60,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        ...Font.Bold
    },
    namesContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    fieldContainer: {
        marginTop: 16,
    },
    saveButton: {
        marginTop: 40,
    },
    logoutButton: {
        marginTop: 20,
    },
    textField: {
        fontWeight: '200',
        paddingVertical: -5,
    },
    deviceIdText: {
        textAlign: 'center',
        color: Colors.GREY,
        fontSize: 14,
    },
    suggestionsTitle: {
        color: Colors.MAIN_COLOR,
        fontSize: 12,
    },
    privacyHeader: {
        fontSize: 12,
        color: Colors.alpha(Colors.N_BLACK, 0.3),
    }
};

const shopEditStyle = StyleSheet.create(style);
export { shopEditStyle as shopEditStyle };
