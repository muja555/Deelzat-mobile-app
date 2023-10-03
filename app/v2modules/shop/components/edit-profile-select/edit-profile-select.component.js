import React, {useEffect, useImperativeHandle, useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Keyboard} from 'react-native';

import { editProfileSelectStyle as style } from './edit-profile-select.component.style';
import {Colors, LayoutStyle} from "deelzat/style";
import SelectModal from "deelzat/ui/select.modal";
import BackSvg from "assets/icons/ArrowRight.svg";
import {DzText} from "deelzat/v2-ui";

const VISIBILITY_BY = {}
VISIBILITY_BY.TOUCH = 'VISIBILITY_BY.TOUCH'
VISIBILITY_BY.AUTO_FOCUS = 'VISIBILITY_BY.AUTO_FOCUS'

const EditProfileSelect = React.forwardRef((props, ref) => {
    const {
        options = [],
        value = null,
        label = '',
        placeholder = '',
        errorMessage = '',
        loading = false,
        keyBy = 'key',
        labelBy = 'label',
        onChange = () => {},
    } = props;

    const [valueText, valueTextSet] = useState('');
    const [isVisible, isVisibleSet] = useState(false);
    const [visibilityBy, visibilityBySet] = useState();


    useImperativeHandle(ref, () => ({
        focus: () => {
            visibilityBySet(VISIBILITY_BY.AUTO_FOCUS);
            isVisibleSet(true);
        },
        isVisibleByAutoFocus: () => visibilityBy === VISIBILITY_BY.AUTO_FOCUS,
    }))


    const onSelect = (value) => {
        onChange(value);
    };


    useEffect(() => {

        if (!value) {
            valueTextSet(placeholder);
            return;
        }

        valueTextSet(value[labelBy]);
    }, [value]);


    const onPress = () => {
        Keyboard.dismiss();
        visibilityBySet(VISIBILITY_BY.TOUCH);
        isVisibleSet(true);
    }

    const onHide = () => {
        isVisibleSet(false);
    }

    return (
        <View style={[style.container, errorMessage && style.errorContainer]}>
            <SelectModal
                multi={false}
                isVisible={isVisible}
                options={options}
                selected={value}
                onSelect={onSelect}
                onHide={onHide}
                keyBy={keyBy}
                labelBy={labelBy}
                title={label}/>
            <View style={LayoutStyle.Row}>
                {
                    (label !== '') &&
                    <DzText style={style.label}>{label}</DzText>
                }
                {
                    (errorMessage !== '') &&
                    <View style={style.errorMessageView}>
                        <DzText style={style.errorMessage}>{errorMessage}</DzText>
                    </View>
                }
            </View>
            <TouchableOpacity
                activeOpacity={1}
                style={style.input}
                onPress={onPress}>
                <View style={LayoutStyle.Row}>
                    <DzText style={[style.text, (placeholder === valueText) && style.placeholder]}>{valueText}</DzText>
                    {
                        loading &&
                        <ActivityIndicator size="small" color={Colors.GREY} />
                    }

                    {
                        !loading &&
                        <BackSvg style={{transform: [{rotate: '90deg'}]}} fill={Colors.GREY} width={15} height={15}/>
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
});

export default EditProfileSelect;
