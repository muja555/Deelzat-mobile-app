import React, { useState } from 'react';
import {View, Image} from 'react-native';

import { productItemInfoStyle as style } from './product-item-info.component.style';
import {Colors, LayoutStyle, TextStyle} from "deelzat/style";
import {DzText, Touchable} from "deelzat/v2-ui";
import {Space} from "deelzat/ui";
import BackSvg from "assets/icons/ArrowRight.svg";

const ProductItemInfo = (props) => {

    return (
        <View style={style.container}>
            <View style={style.imageView}>
                <Image
                    resizeMode='cover'
                    resizeMethod="resize"
                    style={style.image}
                    source={{uri: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1566223684-tretorn-nylite-plus-1566223664.jpg?crop=0.588xw:0.900xh;0.170xw,0.0490xh'}}
                />
            </View>
            <Space directions={'h'}/>
            <View style={LayoutStyle.Row}>
                <DzText style={style.price}>$ 20.04</DzText>
                <Touchable>
                    <BackSvg  fill={Colors.Gray400} width={14} height={14}/>
                </Touchable>
            </View>

            <DzText style={TextStyle.Muted}>This as test Text will added</DzText>
        </View>
    );
};

export default ProductItemInfo;
