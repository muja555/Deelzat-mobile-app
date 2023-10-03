import React, {memo, useCallback, useEffect, useState} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';

import { newlyAddedStyle as style } from './newly-added.component.style';
import I19n, {isRTL} from "dz-I19n";
import {DzText, ImageWithBlur, Touchable} from "deelzat/v2-ui";
import {Space} from "deelzat/ui";
import GetProductsInput from "v2modules/product/inputs/get-products.input";
import ProductApi from "v2modules/product/apis/product.api";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import {
     trackClickOnNewlyAddedSectionProduct, trackClickOnNewlyAddedSectionViewAll
} from "modules/analytics/others/analytics.utils";
import {LayoutStyle} from "deelzat/style";
import {routeToProducts} from "modules/root/components/deeplinks-router/deeplinks-router.utils";
import BookmarkButton from "v2modules/board/components/bookmark-button/bookmark-button.component";
import {refactorImageUrl} from "modules/main/others/main-utils";
import ImagePreviewModalService from "v2modules/shared/modals/image-preview/image-preview.modal.service";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const screenWidth = Dimensions.get('window').width;
const NUM_COLS = 3;
const LABEL_WIDTH = screenWidth * 0.126;
const PADDING = 10;
const GRID_WIDTH = screenWidth - LABEL_WIDTH;
const CELL_WIDTH = Math.floor(GRID_WIDTH / NUM_COLS);
const ITEM_SCALE_HEIGHT = 118 / 95;
const CELL_BOTTOM_PADDING = 16;
const GRID_ITEM_HEIGHT = CELL_WIDTH * ITEM_SCALE_HEIGHT;

let BigLabel, Gradient;
const NewlyAdded = memo((props) => {

    const {
        numberOfProducts = 0,
    } = props;

    const [products, productsSet] = useState([]);
    const [page, pageSet] = useState(1);
    const [measuredGridHeight, measuredGridHeightSet] = useState(0);

    useEffect(() => {

        const input = new GetProductsInput();
        input.page = page;
        input.pageSize = 60;
        ProductApi.getProducts(input, {withBlur: false, withShops: false})
            .then((_list) => {

                let newList = [...products, ..._list];

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
            const trackSource = {name: EVENT_SOURCE.NEWLY_ADDED_SECTION, index};
            RootNavigation.push(MainStackNavsConst.PRODUCT_DETAILS, {
                skeleton: item,
                trackSource: trackSource
            });
            trackClickOnNewlyAddedSectionProduct(item, index);
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

        const FIRST_PADDING_WIDTH = PADDING / 2;
        const LAST_PADDING_WIDTH = PADDING / 2;
        const MID_WIDTH = CELL_WIDTH - FIRST_PADDING_WIDTH - LAST_PADDING_WIDTH;


        return (
            <Touchable key={'' + index}
                       onPress={onPress}
                       onLongPress={onLongPressItem}
                       onPressOut={onPressOutItem}
                       style={[LayoutStyle.Row, {width: CELL_WIDTH, height: GRID_ITEM_HEIGHT + CELL_BOTTOM_PADDING}]}>
                <View style={{width: FIRST_PADDING_WIDTH, height: GRID_ITEM_HEIGHT}}/>
                <View style={[style.innerContainer,
                    {
                        width: MID_WIDTH,
                        height: GRID_ITEM_HEIGHT,
                    }
                ]}>
                    <ImageWithBlur
                        resizeMode="cover"
                        style={style.image}
                        useFastImage={true}
                        thumbnailUrl={refactorImageUrl(item.image, 1)}
                        imageUrl={refactorImageUrl(item.image, CELL_WIDTH)}
                    />
                    <Image source={Gradient} style={style.gradient} />
                    <BookmarkButton isShadowed={true}
                                    style={style.bookmarkBtn}
                                    product={item}
                                    trackSource={{name: EVENT_SOURCE.NEWLY_ADDED_SECTION}}/>
                </View>
                <View style={{width: LAST_PADDING_WIDTH, height: GRID_ITEM_HEIGHT}}/>
            </Touchable>
        )
    }, []);


    const onLayout = ({nativeEvent: {layout: {height}}}) => {
        if (measuredGridHeight < height) {
            measuredGridHeightSet(height);
        }
    }


    const onPressSeeAll = () => {
        const trackSource = {name: EVENT_SOURCE.NEWLY_ADDED_SECTION};
        trackClickOnNewlyAddedSectionViewAll();
        routeToProducts({},
            trackSource);
    }

    if (!products.length) {
        return <></>
    }


    if (!BigLabel) {
        BigLabel = isRTL()? require('assets/icons/NewlyAddedProdsAR.png'): require('assets/icons/NewlyAddedProdsEN.png');
    }

    if (!Gradient) {
        Gradient = require('assets/icons/Gradient3.png');
    }


    return (
        <View style={[style.container, {paddingStart: PADDING / 2}]}>
            <View style={{width: GRID_WIDTH}}>
                <View style={style.productsContainer}
                      onLayout={onLayout}>
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
            <View style={[{width: LABEL_WIDTH}]}>
                <Image source={BigLabel}
                       resizeMode={'stretch'}
                       style={{
                           marginStart: 2,
                           width: LABEL_WIDTH - 10,
                           height: measuredGridHeight - 20,
                       }}/>
            </View>
        </View>
    );
}, () => true);

export default NewlyAdded;
