import React from "react";
import {Colors, Font, LocalizedLayout} from "../style";
import {StyleSheet, TextInput, View} from "react-native";
import {DzText} from "../v2-ui";

const _style = {
    errorMessage: {
        color: Colors.BLACK_RED,
        textAlign: 'left',
    },
    textFieldView: {
        borderRadius: 12,
        height: 48,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingStart: 16,
        paddingEnd: 16,
    },
    textFieldViewError: {
        borderColor: Colors.BLACK_RED
    },
    textField: {
        paddingVertical: 0,
        width: "100%",
        fontWeight: '200',
        borderWidth: 0,
        textAlign: 'left',
        ...Font.Regular
    },
    textAreaView: {
        height: 97,
    },
    textArea: {
        justifyContent: "flex-start",
        textAlignVertical: 'top',
        paddingTop: 10,
    }
};
const style = StyleSheet.create(_style);


const TextField = (props) => {
    const {
        textArea = false,
        textInputRef,
        errorMessage = '',
        inputStyle = {},
        viewStyle = {},
        ...rest
    } = props;

    return (
        <>
            <View style={[style.textFieldView, textArea && style.textAreaView, viewStyle, errorMessage && style.textFieldViewError]}>
                <TextInput
                    placeholderTextColor={Colors.N_BLACK_50}
                    style={[
                        style.textField,
                        textArea && style.textArea,
                        LocalizedLayout.TextAlign(),
                        inputStyle]}
                    ref={textInputRef}
                    {...rest}
                />
            </View>
            {
                (!!errorMessage) &&
                <DzText style={style.errorMessage}>{errorMessage}</DzText>
            }
        </>
    )
}
export default TextField;
