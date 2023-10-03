import React, { useState } from 'react';
import {View, TextInput, ActivityIndicator} from 'react-native';

import { editProfileFieldStyle as style } from './edit-profile-field.component.style';
import {Colors, LocalizedLayout} from "deelzat/style";
import {DzText} from "deelzat/v2-ui";

const EditProfileField = (props) => {
    const {
        label = '',
        errorMessage = '',
        validMessage = '',
        textInputRef,
        textArea = false,
        isLoading = false,
        ...textInputProps
    } = props;

    return (
        <View style={[style.container,
            errorMessage && style.errorContainer,
            validMessage && style.validContainer,
        ]}>
            <View style={style.head}>
                <DzText style={style.label}>
                    {label}
                </DzText>
                {
                    (isLoading) &&
                    <View style={{alignSelf: 'center'}}>
                        <ActivityIndicator
                            size={12}
                            color={Colors.MAIN_COLOR}
                        />
                    </View>
                }
                {
                    (!!errorMessage && errorMessage !== '') &&
                    <View style={style.messageView}>
                        <DzText style={style.errorMessage}>{errorMessage}</DzText>
                    </View>
                }
                {
                    (!!validMessage && validMessage !== '') &&
                    <View style={style.messageView}>
                        <DzText style={style.validMessage}>{validMessage}</DzText>
                    </View>
                }
            </View>
            <TextInput
                ref={textInputRef}
                placeholderTextColor={Colors.GREY}
                style={[style.textInput, textArea && style.textArea, LocalizedLayout.TextAlign()]}
                {...textInputProps}
                />
        </View>
    );
};

export default EditProfileField;
