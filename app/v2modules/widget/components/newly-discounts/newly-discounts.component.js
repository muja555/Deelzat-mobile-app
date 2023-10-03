import React, {memo, useCallback, useEffect, useState} from 'react';
import {View, Text, Image, Dimensions} from 'react-native';

import { newlyDiscountsStyle as style } from './newly-discounts.component.style';
import I19n, {isRTL} from "dz-I19n";
import ProductApi from "v2modules/product/apis/product.api";
import GetProductsInput from "v2modules/product/inputs/get-products.input";
import {LayoutStyle, LocalizedLayout} from "deelzat/style";
import {DzText, ImageWithBlur, Touchable} from "deelzat/v2-ui";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import {
    trackClickOnDiscountSectionProduct,
    trackClickOnDiscountsSectionViewAll,
} from "modules/analytics/others/analytics.utils";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import {routeToProducts} from "modules/root/components/deeplinks-router/deeplinks-router.utils";
import {Space} from "deelzat/ui";
import {refactorImageUrl} from "modules/main/others/main-utils";
import OrangeCorner from "assets/icons/OrangeCorner.svg";
import ImagePreviewModalService from "v2modules/shared/modals/image-preview/image-preview.modal.service";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const screenWidth = Dimensions.get('window').width;
const PADDING = 16;
const GRID_WIDTH = screenWidth - PADDING;
const NUM_COLS = 3;
const ITEM_WIDTH = GRID_WIDTH / NUM_COLS;
const ITEM_SCALE_HEIGHT = 125 / 114;
const GRID_ITEM_HEIGHT = ITEM_SCALE_HEIGHT * ITEM_WIDTH;

let ImageTitle;
const NewlyDiscounts = memo((props) => {
    const {
        numberOfProducts = 0,
    } = props;

    const [products, productsSet] = useState([]);
    const [page, pageSet] = useState(1);

    if (!ImageTitle) {
        ImageTitle = isRTL()? require('assets/icons/DiscountsAR.png')
            : require('assets/icons/DiscountsEN.png');
    }


    useEffect(() => {

        const input = new GetProductsInput();
        input.page = page;
        input.pageSize = 500;
        ProductApi.getProducts(input, {withBlur: false, withShops: false, isJustDiscounts: true})
            .then((_list) => {

                let newList = [];
                if (_list.length > 0 && products.length > 0) {
                   // newList = prepareProductHits([...products, ..._list]) || [];
                    newList = [...products, ..._list];
                } else {
                    newList = [...products, ..._list];
                }


                if (newList.length < numberOfProducts) {
                    productsSet(newList);
                    pageSet(page + 1);
                }
                else {
                    newList = newList.slice(0, numberOfProducts);
                    productsSet(newList);
                }

            })
            .catch(console.warn)

    }, [page]);


    const renderItem = useCallback((item, index) => {

        const onPress = () => {
            const trackSource = {name: EVENT_SOURCE.DISCOUNTS_SECTION, index};
            RootNavigation.push(MainStackNavsConst.PRODUCT_DETAILS, {
                skeleton: item,
                trackSource: trackSource
            });
            trackClickOnDiscountSectionProduct(item, index);
        }

        const onLongPressItem = () => {
            ImagePreviewModalService.setVisible({
                show: true,
                imageUrl: item?.image
            });
        };

        const onPressOutItem = () => {
            ImagePreviewModalService.setVisible({
                show: false
            });
        }


        const discountPercentage = Math.floor(((item.compare_at_price - item.price) / item.compare_at_price) * 100);

        return (
            <Touchable onPress={onPress}
                       key={''+index}
                       onLongPress={onLongPressItem}
                       onPressOut={onPressOutItem}
                       style={[LayoutStyle.Row, {width: ITEM_WIDTH, height: GRID_ITEM_HEIGHT + 5}]}>
                <View style={{width: PADDING / 5}}/>
                <View>
                    <ImageWithBlur
                        attatchToObj={item}
                        resizeMode='cover'
                        useFastImage={true}
                        resizeMethod="resize"
                        style={[{
                            width: ITEM_WIDTH - (PADDING / 4 ),
                            height: GRID_ITEM_HEIGHT
                        }, style.image]}
                        thumbnailUrl={refactorImageUrl(item.image, 1)}
                        imageUrl={refactorImageUrl(item.image, ITEM_WIDTH)}
                    />
                    <View style={style.saleView}>
                        <DzText style={style.saleText}>
                            {I19n.t('خصم')}
                        </DzText>
                    </View>
                    <OrangeCorner width={ITEM_WIDTH * 0.55} height={GRID_ITEM_HEIGHT * 0.49} style={[style.orangeCorner, LocalizedLayout.ScaleX()]}/>
                    <DzText style={style.discount}>
                        {discountPercentage + '%'}
                    </DzText>
                </View>
                <View style={{width: PADDING / 5}}/>
            </Touchable>
        )
    }, []);


    const onPressSeeAll = () => {
        const trackSource = {name: EVENT_SOURCE.DISCOUNTS_SECTION};
        trackClickOnDiscountsSectionViewAll();
        routeToProducts({isJustDiscounts: true},
            trackSource);
    }

    return (
        <View style={style.container}>
            <Space size={'lg'} directions={'h'} />
            <Image source={ImageTitle} style={{width: screenWidth * 0.8, height: screenWidth * 0.3}}/>
            <Space size={'lg'} directions={'h'} />
            {
                (products.length > 0) &&
                <View style={{width: GRID_WIDTH}}>
                    <View style={style.productsContainer}>
                        {
                            products.map((item, index) => renderItem(item, index))
                        }
                    </View>
                    <Touchable onPress={onPressSeeAll}>
                        <Space directions={'h'} size={'sm'}/>
                        <DzText style={style.seeAll}>
                            {I19n.t('أظهر المزيد')}
                        </DzText>
                    </Touchable>
                </View>
            }
        </View>
    );
}, () => true);

export default NewlyDiscounts;
