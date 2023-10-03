import React, { useCallback, useEffect, useState } from 'react';
import { View, Animated, FlatList } from 'react-native';

import { productListStyle as style } from './product-list.component.style';
import ProductListItem from 'v2modules/product/components/product-list-item/product-list-item.component';
import { Space } from 'deelzat/ui';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import { logAlgoliaEventProductClicked } from 'modules/analytics/others/analytics.utils';
import { Colors } from 'deelzat/style';

const ProductList = (props) => {
    const {
        products = [],
        allowEdit = false,
        currencyCode,
        trackSource,
        flatListRef,
        btnColor = Colors.MAIN_COLOR,
        onActionPress = (item, actionType, extraData, trackSource) => {},
        onLongPressItem = () => {},
        onPressOutItem = () => {},
        displayMinimalLook = false,
        ...rest
    } = props;

    const renderItem = useCallback(({ item, index }) => {
        const itemTrackSource = { ...trackSource, index };

        const onPress = () => {
            RootNavigation.push(MainStackNavsConst.PRODUCT_DETAILS, {
                skeleton: item,
                trackSource: itemTrackSource,
            });

            logAlgoliaEventProductClicked(item, index);
        };

        const _onActionPress = (item, actionType, extraData) =>
            onActionPress(item, actionType, extraData, itemTrackSource);
        const onLongPress = () => onLongPressItem(item);
        const onPressOut = () => onPressOutItem(item);


        const productView = (
            <ProductListItem
                product={item}
                btnColor={btnColor}
                currencyCode={currencyCode}
                onPress={onPress}
                onLongPress={onLongPress}
                onPressOut={onPressOut}
                onActionPress={_onActionPress}
                bookmarkTrackSource={itemTrackSource}
                allowEdit={allowEdit}
                displayMinimalLook={displayMinimalLook}
            />
        );


        if (displayMinimalLook) {
            return (
                <View style={style.itemContainerMin}>
                    <View style={{width: 4}}/>
                    <View style={{flex: 1}}>
                        {productView}
                    </View>
                    <View style={{width: 4}}/>
                </View>
            )
        }

        return (
            <View style={style.itemContainer}>
                {productView}
            </View>

        );
    }, [btnColor])

    const keyExtractor = useCallback((item) => `${item.id}`, []);
    const Separator = useCallback(() => {
        if (displayMinimalLook) {
            return <View style={{height: 12}} />
        }

        return <Space directions={'h'} size={['md', '']} />;
    }, []);

    return (
        <View style={style.container}>
            <Animated.FlatList
                ref={flatListRef}
                data={products}
                renderItem={renderItem}
                numColumns={displayMinimalLook ? 3 : 2}
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={style.listContents}
                columnWrapperStyle={!displayMinimalLook && style.listColumnWrapper}
                ItemSeparatorComponent={Separator}
                keyExtractor={keyExtractor}
                {...rest}
            />
        </View>
    );
};

export default ProductList;
