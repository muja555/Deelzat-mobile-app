import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Animated, Easing} from 'react-native';
import GiftIcon from "assets/icons/Gift.svg";

import { addonListItemStyle as style } from './addon-list-item.component.style';
import {DzText, Touchable} from "deelzat/v2-ui";
import {TextField} from "deelzat/v2-form";
import {Space} from "deelzat/ui";
import {trackCheckoutAddonFieldFilled, trackSelectCheckoutAddon} from "modules/analytics/others/analytics.utils";
import CostTypeConst from "v2modules/checkout/constants/cost-type.const";
import {getLocale, isRTL} from "dz-I19n";
import {LocalizedLayout} from "deelzat/style";

const AddonListItem = (props) => {
    const {
        addon = {},
        onChangeAddon = (addon) => {},
        currencyCode = '',
    } = props

    const isAnimating = useRef(false);
    const [isMeasured, isMeasuredSet] = useState(false);
    const headerHeight = useRef(0);
    const contentHeight = useRef(0);
    const contentHeightAnim = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        isAnimating.current = true;
        Animated.timing(
            contentHeightAnim,
            {
                toValue: addon.isSelected?
                    headerHeight.current + contentHeight.current :
                    headerHeight.current,
                duration: 200,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false
            }
        ).start(() => {
            isAnimating.current = false;
        })
    }, [addon.isSelected]);


    const onPressCheck = () => {
        const _isSelected = !addon.isSelected;
        const _addon = {...addon, isSelected: _isSelected};
        onChangeAddon(_addon);
        trackSelectCheckoutAddon(_addon);
    }


    const onChangeAddonField = (fieldText, text) => {
        addon.required_fields.forEach((requiredField) => {
            if (requiredField.text === fieldText)
                requiredField.value = text
        })
        onChangeAddon(addon);
    }


    const renderFields = addon.required_fields?.map((requiredField, index) => {

        const onChangeText = (value) => {
            onChangeAddonField(requiredField.text, value);
        }

        return (
            <View key={requiredField.text} style={!addon.isSelected && {opacity: 0}}>
                <DzText style={[style.fieldLabel, LocalizedLayout.TextAlign(isRTL())]}>
                    {requiredField[getLocale()]}
                </DzText>
                <TextField placeholder={''}
                           value={requiredField.value}
                           onChangeText={onChangeText}
                           textArea={true}
                           multiline={true}
                           numberOfLines={20}
                           onBlur={() => trackCheckoutAddonFieldFilled(addon, requiredField.text, requiredField.value)}/>
                {
                    (index < addon.required_fields.length - 1) &&
                    <Space directions={'h'} size={'md'}/>
                }
            </View>
        )
    });


    const onLayoutHeader = ({nativeEvent: {layout: {height}}}) => {
        if (headerHeight.current === 0) {
            contentHeightAnim.setValue(height);
            headerHeight.current = height;
            isMeasuredSet(true);
        }
    }


    const onLayoutContent = ({nativeEvent: {layout: {height}}}) => {
        if (addon.isSelected) {
            contentHeightAnim.setValue(height);
        }

        if (contentHeight.current === 0) {
            contentHeight.current = height;
        }
    }


    return (
        <Animated.View style={[style.container, isMeasured && {height: contentHeightAnim}]}>
            <Touchable
                activeOpactity={1}
                underlayColor="#fff"
                onPress={onPressCheck}
                onLayout={onLayoutHeader}
                hitSlop={{top: 10, bottom: 10, left: 400, right: 400}}>
                <View style={style.rowView}>
                    <GiftIcon width={24} heigh={24}/>
                    <Space directions={'v'} size={['', 'md']}/>
                    <DzText style={[style.optionLabel, LocalizedLayout.TextAlign(isRTL())]}>
                        {addon[getLocale()]}
                    </DzText>
                    <DzText style={style.addonCost}>
                        {(addon.cost_type === CostTypeConst.AMOUNT) && (addon.cost_value + ' ' + currencyCode)}
                        {(addon.cost_type === CostTypeConst.PERCENTAGE) && (addon.cost_value + ' %')}
                    </DzText>
                    <View style={style.radio}>
                        {
                            (addon.isSelected) &&
                            <View style={style.selectedMark}/>
                        }
                    </View>
                </View>
            </Touchable>
            <View onLayout={onLayoutContent}>
                <Space directions={'h'}/>
                {renderFields}
            </View>
        </Animated.View>
    );
};

export default AddonListItem;
