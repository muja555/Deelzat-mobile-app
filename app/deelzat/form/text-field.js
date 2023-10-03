import React from 'react';
import {ActivityIndicator, Text, TextInput, View} from 'react-native';
import {formStyle as style} from "./style";
import {Colors, LocalizedLayout} from "../style";
import {DzText} from "../v2-ui";


const TextField = (props) => {

    const {
        label = '',
        errorMessage = '',
        validMessage = '',
        textArea = false,
        prepend = <></>,
        inputStyle = {},
        textInputRef,
        isLoading = false,
        viewStyle = {},
        ...rest
    } = props;

    return (
        <View style={viewStyle}>
            <View style={style.head}>
                {
                    (label !== '') &&
                    <DzText style={style.label}>{label}</DzText>
                }
                {
                    (isLoading) &&
                    <View style={{alignSelf: 'center', marginStart: 10}}>
                        <ActivityIndicator
                            size={12}
                            color={Colors.MAIN_COLOR}
                        />
                    </View>
                }
                {
                    (!!errorMessage && errorMessage !== '') &&
                    <View style={style.errorMessageView}>
                        <DzText style={style.errorMessage}>{errorMessage}</DzText>
                    </View>
                }
                {
                    (!!validMessage && validMessage !== '') &&
                    <View style={style.errorMessageView}>
                        <DzText style={style.validMessage}>{validMessage}</DzText>
                    </View>
                }
            </View>
            <View style={[style.textFieldView, textArea ? style.textAreaView : null, inputStyle]}>
                {prepend}
                <TextInput
                    style={[style.textField, textArea ? style.textArea : null, inputStyle, LocalizedLayout.TextAlign()]}
                    ref={textInputRef}
                    {...rest}
                />
            </View>

        </View>
    )


};

export default TextField;
