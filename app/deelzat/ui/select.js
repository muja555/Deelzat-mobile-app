import React, {useEffect, useImperativeHandle, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import SelectModal from "./select.modal";
import {Colors, Font} from "deelzat/style"
import BackSvg from "assets/icons/ArrowRight.svg";
import DzText from "../v2-ui/dz-text";

const _style = {
    input: {
        width: '100%',
        backgroundColor: '#fff',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderColor: Colors.GREY,
        borderWidth: 1,
        paddingHorizontal: 16,
        flexDirection: 'row'
    },
    text: {
        color: '#000',
        flex: 1,
        textAlign: 'left',
        ...Font.Regular
    }
};
const style = StyleSheet.create(_style);

const VISIBILITY_BY = {}
VISIBILITY_BY.TOUCH = 'VISIBILITY_BY.TOUCH'
VISIBILITY_BY.AUTO_FOCUS = 'VISIBILITY_BY.AUTO_FOCUS'

const Select = React.forwardRef((props, ref) => {

    const {
        options = [],
        value = null,
        onChange = () => {},
        keyBy = 'key',
        labelBy = 'label',
        multi = false,
        loading = false,
        title = '',
        buttonStyle = {},
        arrowColor = Colors.GREY,
    } = props;

    const [isVisible, isVisibleSet] = useState(false);
    const [visibilityBy, visibilityBySet] = useState();
    const [label, labelSet] = useState('');

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
            labelSet('');
            return;
        }

        if (multi) {
            if (!Array.isArray(value)) {
                throw "Select: value should array when multi = true"
            }
            const valuesLabels = value.map((item) => item[labelBy]);
            labelSet(valuesLabels.join(' , '));
        }
        else {
            labelSet(value[labelBy]);
        }
    }, [value]);

    return (
        <View>
            <SelectModal
                multi={multi}
                isVisible={isVisible}
                options={options}
                selected={value}
                onSelect={onSelect}
                onHide={() => { isVisibleSet(false); }}
                keyBy={keyBy}
                labelBy={labelBy}
                title={title}
            />
            <TouchableOpacity
                activeOpacity={1}
                style={[style.input, buttonStyle]}
                onPress={() => { visibilityBySet(VISIBILITY_BY.TOUCH); isVisibleSet(true); }}>
                <DzText style={style.text}>{label}</DzText>
                {
                    loading &&
                    <ActivityIndicator size="small" color={Colors.GREY} />
                }

                {
                    !loading &&
                    <BackSvg style={{transform: [{rotate: '90deg'}]}} fill={arrowColor} width={15} height={15}/>
                }

            </TouchableOpacity>
        </View>
    );
});

export default Select;
