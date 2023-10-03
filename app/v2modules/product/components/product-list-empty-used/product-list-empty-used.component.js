import React, {useState} from 'react';
import {View, Text} from 'react-native';
import NoUsedProductsARIcon from "assets/icons/NoUsedAR.svg";
import NoUsedProductsENIcon from "assets/icons/NoUsedEN.svg";
import NoNewProductsENIcon from "assets/icons/NoNewEN.svg";

import {productListEmptyUsedStyle as style} from './product-list-empty-used.component.style';
import {isRTL} from "dz-I19n";
import {Space} from "deelzat/ui";
import {DzText} from "deelzat/v2-ui";

const ProductListEmptyUsed = (props) => {

    const {
        isUsedTab = true,
        containerStyle = {}
    } = props;

    if (isRTL()) {
        return (
            <View style={[style.container, containerStyle]}>
                <DzText style={style.bigTitleAR}>
                    {isUsedTab? 'لا يوجد منتجات مستعملة': 'لا يوجد منتجات جديدة'}
                </DzText>
                <Space directions={'h'} size={'lg'}/>
                <NoUsedProductsARIcon/>
                <Space directions={'h'} size={'lg'}/>
                <DzText style={style.subTitle}>
                    ما تقلق، لسا بإمكانك تتسوق منتجات جديدة.
                </DzText>
                <DzText style={style.subTitle}>
                    شو بتستنى!
                </DzText>
            </View>
        );
    }

    return (
        <View style={[style.container, containerStyle]}>
           <>
                {
                    (isUsedTab) &&
                    <NoUsedProductsENIcon/>
                }
                {
                    (!isUsedTab) &&
                    <NoNewProductsENIcon />
                }
           </>
            <Space directions={'h'} size={'lg'}/>
            <DzText style={style.subTitle}>
                Discover all the new products in
            </DzText>
            <DzText style={style.subTitle}>
                Deelzat & enjoy shopping.
            </DzText>
        </View>
    );
};

export default ProductListEmptyUsed;
