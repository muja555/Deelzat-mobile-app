import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { shopItemStyle as style } from './shop-item.component.style';
import FastImage from "@deelzat/react-native-fast-image";
import {LayoutStyle, TextStyle} from "deelzat/style";
import {Touchable} from "deelzat/v2-ui";
import {DzText} from "deelzat/v2-ui";

const ShopItem = (props) => {

    const {
        shop = null,
        flag = true,
    } = props;

    if (!shop) {
        return <></>;
    }

    return (
        <View style={style.container}>
            <FastImage
                resizeMode='cover'
                resizeMethod="resize"
                style={style.image}
                source={{uri: 'https://techcrunch.com/wp-content/uploads/2021/04/IMG_0852.jpg'}}
            />
            <View style={style.info}>
                <DzText style={style.name}>Shop name</DzText>
                <View style={LayoutStyle.Row}>
                    <DzText style={style.count}>11</DzText>
                    <DzText style={style.label}> Followers / </DzText>
                    <DzText style={style.count}>209</DzText>
                    <DzText style={style.label}> Item</DzText>
                </View>
            </View>

            {
                (!flag) &&
                <Touchable style={style.followBtn}>
                    <DzText style={TextStyle.Primary}>Follow</DzText>
                </Touchable>
            }

            {
                (!!flag) &&
                <View style={style.followingView}>
                    <DzText style={TextStyle.White}>Following</DzText>
                </View>
            }
        </View>
    );
};

export default ShopItem;
