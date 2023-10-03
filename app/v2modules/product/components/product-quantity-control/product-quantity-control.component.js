import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { productQuantityControlStyle as style } from './product-quantity-control.component.style';
import {Touchable} from "deelzat/v2-ui";
import Toast from "deelzat/toast";
import {Colors} from "deelzat/style";
import {DzText} from "deelzat/v2-ui";

const ProductQuantityControl = (props) => {

    const {
        value = 1,
        onChange = (value) => {},
        min = 1,
        max = 999,
        displayToast = false
    } = props;

    const setValue = (add) => {

        const newValue = parseInt(value) + parseInt(add);
        const reachMin = newValue < min;
        const reachMax = newValue > max;

        let msg  = 'min';
        if (reachMax) {
            msg = 'max'
        }

        if (!reachMin && !reachMax) {
            onChange(newValue);
        }
        else if (displayToast) {
            Toast.default(msg)
        }

    };

    const minBtnDisabled = value <= 1;
    const maxBtnDisabled = value >= max;

    return (
        <View style={style.container}>

            <Touchable style={[style.btn, minBtnDisabled && {opacity: 0.6}]} disabled={minBtnDisabled} onPress={() => setValue(-1)}>
                <DzText style={style.btnText}>-</DzText>
            </Touchable>

            <DzText style={[style.value, maxBtnDisabled && {color: Colors.MAIN_COLOR}]}>
                {value}
            </DzText>

            <Touchable style={[style.btn, maxBtnDisabled && {opacity: 0.6}]} disabled={maxBtnDisabled} onPress={() => setValue(1)}>
                <DzText style={style.btnText}>+</DzText>
            </Touchable>

        </View>
    );
};

export default ProductQuantityControl;
