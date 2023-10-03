import React, {memo, useState} from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';

import { trendingTryItemStyle as style } from './trending-try-item.component.style';
import FastImage from "@deelzat/react-native-fast-image";
import BookmarkButton from "v2modules/board/components/bookmark-button/bookmark-button.component";
import Gradient from 'assets/icons/Gradient.svg';
import ImageWithBlur from "deelzat/v2-ui/image-with-blur";
import {refactorImageUrl} from "modules/main/others/main-utils";
import {DzText} from "deelzat/v2-ui";
import {useSelector} from "react-redux";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import ImagePreviewModalService from "v2modules/shared/modals/image-preview/image-preview.modal.service";
import ShopImage from 'v2modules/shop/components/shop-image/shop-image.component';

const TrendingTryItem = memo((props) => {

    const {
        product = {},
        onPress = () => {},
        itemStyle = {},
    } = props;

    const currencyCode = useSelector(geoSelectors.currencyCodeSelector);

    const onLongPress = () => {
        ImagePreviewModalService.setVisible({
            show: true,
            imageUrl: product?.image
        });
    };

    const onPressOut = () => {
        ImagePreviewModalService.setVisible({
            show: false
        });
    }


    return (
        <TouchableOpacity style={[style.container, itemStyle]}
                          activeOpacity={0.8}
                          onLongPress={onLongPress}
                          onPressOut={onPressOut}
                          onPress={onPress}>
            <View style={style.innerContainer}>
                <ImageWithBlur
                    thumbnailUrl={refactorImageUrl(product.image,  1)}
                    style={style.image}
                    resizeMode="cover"
                    imageUrl={refactorImageUrl(product.image, itemStyle.width * 1.3)}
                />
                <View style={[style.gradient, itemStyle]}>
                    <Gradient width={'100%'} height={'100%'}/>
                </View>
                {
                    (product.shop) &&
                    <View style={style.shopInfo}>
                        <ShopImage style={style.shopImage}
                                   image={product.shop.picture}/>
                        <DzText numberOfLines={2} style={style.shopName}>
                            {product.shop.name}
                        </DzText>
                    </View>
                }
                <DzText style={style.price}>
                    {parseFloat(product.price) + ' ' + currencyCode}
                </DzText>
                <BookmarkButton isShadowed={true}
                                style={style.bookmarkBtn}
                                product={product}
                                trackSource={{name: EVENT_SOURCE.TRENDING}}/>
            </View>
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    return prevProps.product.id === nextProps.product.id;
})

export default TrendingTryItem;
