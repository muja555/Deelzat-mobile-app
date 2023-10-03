import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableHighlight, View} from 'react-native';
import Colors from "./../style/colors"

import {style} from './button.style';
import DzText from "../v2-ui/dz-text";

const TouchableHighlightPreventDoublePress = (props) => {
    const {
        onPress = () => {},
    } = props;

    const [isOnPressDisabled, isOnPressDisabledSet] = useState(false);

    useEffect(() => {

        let timeout;
        if (isOnPressDisabled) {
            timeout = setTimeout(() => {
                isOnPressDisabledSet(false);
            }, 500);
        }

        return () => {
            clearTimeout(timeout);
        }
    }, [isOnPressDisabled]);

    const thisOnPress = () => {
        if (isOnPressDisabled) return;
        isOnPressDisabledSet(true);

        if (onPress) {
            onPress();
        }
    }

    return (
        <TouchableHighlight {...props}
                            onPress={thisOnPress}>
            {props.children}
        </TouchableHighlight>
    );
}

const ButtonOptions = {
    Size: {
        LG: 'LG',
        MD: 'MD',
        SM: 'SM'
    },
    Type: {
        PRIMARY: 'PRIMARY',
        PRIMARY_OUTLINE: 'PRIMARY_OUTLINE',
        SECONDARY: 'SECONDARY',
        SECONDARY_OUTLINE: 'SECONDARY_OUTLINE',
        MUTED: 'MUTED',
        MUTED_OUTLINE: 'MUTED_OUTLINE',
        DANGER: 'DANGER',
        DANGER_OUTLINE: 'DANGER_OUTLINE',
        MAUVE: 'MAUVE',
        MAUVE_OUTLINE: 'MAUVE_OUTLINE',
        ORANGY: 'ORANGY',
        ORANGY_OUTLINE: 'ORANGY_OUTLINE',
        BLUE: 'BLUE',
        BLUE_OUTLINE: 'BLUE_OUTLINE',
        BLACK: 'BLACK'
    }
};

const ActivityIndicatorOptions = {
    Size: {
        [ButtonOptions.Size.LG]: 16,
        [ButtonOptions.Size.MD]: 14,
        [ButtonOptions.Size.SM]: 12,
    },
    Color: {
        [ButtonOptions.Type.PRIMARY]: '#fff',
        [ButtonOptions.Type.PRIMARY_OUTLINE]: Colors.MAIN_COLOR,
        [ButtonOptions.Type.SECONDARY]: '#fff',
        [ButtonOptions.Type.SECONDARY_OUTLINE]: Colors.BLUEBERRY,
        [ButtonOptions.Type.MUTED]: Colors.GREY,
        [ButtonOptions.Type.MUTED_OUTLINE]: Colors.GREY,
        [ButtonOptions.Type.DANGER]: '#fff',
        [ButtonOptions.Type.DANGER_OUTLINE]: Colors.ERROR_COLOR,
        [ButtonOptions.Type.MAUVE]: '#fff',
        [ButtonOptions.Type.MAUVE_OUTLINE]: Colors.GREY,
        [ButtonOptions.Type.ORANGY]: Colors.ORANGE_PINK,
        [ButtonOptions.Type.ORANGY_OUTLINE]: Colors.ORANGE_PINK,
        [ButtonOptions.Type.BLUE]: '#fff',
        [ButtonOptions.Type.BLUE_OUTLINE]: Colors.GREY,
        [ButtonOptions.Type.BLACK]: 'black',

    }
};

export {ButtonOptions as ButtonOptions}

const Button = (props) => {

    const {
        onPress = () => {},
        size = ButtonOptions.Size.LG,
        type = ButtonOptions.Type.PRIMARY,
        text = 'Button',
        disabled = false,
        loading = false,
        loadingColor = undefined,
        btnStyle = {},
        textStyle = {},
        separated = false,
        hideLabel = false,
        icon = <></>,
        iconEnd = <></>,
        hitSlop,
    } = props;

    return  (
        <TouchableHighlightPreventDoublePress
            disabled={disabled || loading}
            activeOpacity={0.8}
            hitSlop={hitSlop}
            underlayColor="transparent"
            onPress={onPress}>
            <View style={[style.btn, style['btn_type_' + type], style['btn_size_' + size], disabled ? style.disabled : null, btnStyle]}>
                {iconEnd}
                {
                    loading &&
                    <ActivityIndicator
                        style={style.activityIndicator}
                        size={ActivityIndicatorOptions.Size[size]}
                        color={loadingColor || ActivityIndicatorOptions.Color[type]}
                    />
                }

                {
                    (!hideLabel) &&
                    <DzText style={[style.btn_text, style['btn_text_type_' + type], style['btn_text_size_' + size], textStyle]}> {text} </DzText>
                }

                {
                    !!separated &&
                    <View style={{flex: 1}}/>
                }

                {icon}
            </View>
        </TouchableHighlightPreventDoublePress>
    )
};

export default Button;
