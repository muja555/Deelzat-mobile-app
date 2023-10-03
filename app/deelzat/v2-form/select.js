import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Keyboard, StyleSheet, TextInput } from 'react-native';

import {Colors, Font, LayoutStyle} from "deelzat/style";
import SelectModal from "deelzat/ui/select.modal";
import BackSvg from "assets/icons/PanelHandle.svg";
import {DzText} from "../v2-ui";

const _style = {
    input: {
        borderRadius: 12,
        height: 48,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    inputError: {
        borderColor: Colors.BLACK_RED
    },
    text: {
        color: '#000',
        flex: 1,
        textAlign: 'left',
        ...Font.Regular
    },
    placeholder: {
        color: Colors.N_BLACK_50
    },
    handle: {
        marginTop: 3,
    },
    errorMessage: {
        color: Colors.BLACK_RED,
        textAlign: 'left',
    }
}
const style = StyleSheet.create(_style);

const VISIBILITY_BY = {};
VISIBILITY_BY.TOUCH = 'VISIBILITY_BY.TOUCH';
VISIBILITY_BY.AUTO_FOCUS = 'VISIBILITY_BY.AUTO_FOCUS';

const Select = React.forwardRef((props, ref) => {
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

        if (!value || !value[labelBy]) {
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

    const isError = errorMessage !== '';

    return (
        <View>
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
            <TouchableOpacity
                activeOpacity={1}
                style={[style.input, isError && style.inputError]}
                onPress={onPress}>
                <View style={LayoutStyle.Row}>
                    <DzText style={[style.text, (placeholder === valueText) && style.placeholder]}>
                        {valueText}
                    </DzText>
                    {
                        loading &&
                        <ActivityIndicator size="small" color={Colors.GREY} />
                    }

                    {
                        !loading &&
                        <BackSvg style={style.handle} stroke={Colors.N_BLACK} strokeWidth={1.7} width={15} height={15}/>
                    }
                </View>
            </TouchableOpacity>
            {
                (isError) &&
                <DzText style={style.errorMessage}>{errorMessage}</DzText>
            }
        </View>
    );
});

export default Select;
