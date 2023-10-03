import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, Dimensions, Platform} from 'react-native';

import { trendingTryStyle as style } from './trending-try.component.style';
import TrendingItem from "v2modules/widget/components/trending-try-item/trending-try-item.component";
import GetProductsInput from "v2modules/product/inputs/get-products.input";
import ProductApi from "v2modules/product/apis/product.api";
import ContentLoader, {Rect} from "react-content-loader/native";
import {getLocale, isRTL} from "dz-I19n";
import {DzText} from "deelzat/v2-ui";
import {Space} from "deelzat/ui";
import {extendArabicLetters} from "modules/main/others/main-utils";
import {Colors, Spacing} from "deelzat/style";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import {trackClickOnTrendingProduct} from "modules/analytics/others/analytics.utils";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Item width related to screen width
const ITEM_SCALE_WIDTH = 123 / 375;
const ITEM_WIDTH = ITEM_SCALE_WIDTH * SCREEN_WIDTH;
// Item dimensions design scale
const ITEM_SCALE = 123 / 154;
const ITEM_HEIGHT = ITEM_WIDTH / ITEM_SCALE;

const NUM_OF_ITEMS_PER_PAGE = Math.ceil(SCREEN_WIDTH / (style.listSeparator.width + ITEM_WIDTH));


const TrendingTry = (props) => {

    const {
        item = {},
    } = props;

    const [products, productsSet] = useState([]);

    useEffect(() => {
        const inputs = new GetProductsInput();
        inputs.filters = item.filters;
        inputs.pageSize = 100; // It's already limited in the filter
        ProductApi.getProducts(inputs, {withBlur: false, withShops: true})
            .then(productsSet)
            .catch(console.warn);

    }, []);


    const itemStyle = {height: ITEM_HEIGHT, width: ITEM_WIDTH};
    const renderItem = useCallback(({item, index}) => {

        const onPressItem = () => {
            RootNavigation.push(MainStackNavsConst.PRODUCT_DETAILS, {
                skeleton: item,
                trackSource: {name: EVENT_SOURCE.TRENDING}
            });
            trackClickOnTrendingProduct(item, index);
        }

        return (
            <TrendingItem
                product={item}
                onPress={onPressItem}
                itemStyle={itemStyle}/>
        )
    }, []);

    const renderSeparator = useCallback(() => {
        return (
            <View style={style.listSeparator}/>
        )
    }, []);

    const keyExtractor = useCallback((_item, index) => `${_item.objectID}_${index}`, []);
    const title = item[getLocale()];

    const renderTitle = (
        <DzText style={style.title}>
            {
                title.split(' ').map((partStr, index) => {
                    return (
                        <DzText
                            key={'' + index}
                            style={[
                                style.title,
                                !isRTL() && {letterSpacing: 8},
                                (partStr.toLowerCase() === 'deelzat' || partStr === 'ديلزات') && {color: Colors.MAIN_COLOR}
                            ]}>
                            {(index !== 0 ? ' ' : '') + (isRTL() ? extendArabicLetters(partStr) : partStr)}
                        </DzText>
                    )
                })
            }
        </DzText>
    )

    return (
        <View style={style.container}>
            <DzText style={[style.title, !isRTL() && {letterSpacing: 8}]}>
                {renderTitle}
            </DzText>
            <Space directions={'h'} size={'md'} />
            {
                (products.length === 0) &&
                <TrendingLoadingView itemStyle={itemStyle}/>
            }
            {
                (products.length > 0) &&
                <FlatList
                    contentContainerStyle={style.innerContainer}
                    data={products}
                    initialNumToRender={100}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={0}
                    ItemSeparatorComponent={renderSeparator}
                    ListFooterComponent={renderSeparator}
                    ListHeaderComponent={renderSeparator}
                />
            }
        </View>
    )
}

const TrendingLoadingView = ({itemStyle}) => {

    const itemsSpace = style.listSeparator.width;
    const renderRectangles =
        Array.from({length: NUM_OF_ITEMS_PER_PAGE}).map((_, index) => {
            const withPaddingMargin = (itemsSpace * (index));
            const x = (index * itemStyle.width) + withPaddingMargin;
            return (
                <Rect key={index+''} x={x} y={0} rx={12} ry={12} width={itemStyle.width} height={itemStyle.height}/>
            )
        });

    return (
        <View style={[
            style.loadingView,
            {height: itemStyle.height},
            {transform: [{scaleX: isRTL()? -1 : 1}]},
            !isRTL() && {paddingStart: Spacing.HorizontalPadding.paddingStart},
            isRTL() && {paddingEnd: Spacing.HorizontalPadding.paddingStart},
        ]}>
            <ContentLoader speed={0.6} interval={0.3}
                           foregroundColor={'#76b5c5'}
                           backgroundColor={'#abdbe3'}>
                {renderRectangles}
            </ContentLoader>
        </View>
    )
}


export default TrendingTry;
