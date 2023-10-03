import React, {useCallback} from 'react';
import {View, Text, ActivityIndicator, Image, FlatList, Dimensions} from 'react-native';

import { savedTabAllItemsStyle as style } from './saved-tab-all-items.component.style';
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import {Colors, LayoutStyle} from "deelzat/style";
import EmptySavedIcon from "assets/icons/EmptySaved.png";
import I19n from 'dz-I19n';
import {Space} from "deelzat/ui";
import {DzText, ImageWithBlur, Touchable} from "deelzat/v2-ui";
import {refactorImageUrl} from "modules/main/others/main-utils";
import CloseIcon from "assets/icons/Close.svg";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import useProductOptionsModal from "v2modules/product/modals/product-options/product-options.modal";
import {cartThunks} from "modules/cart/stores/cart/cart.store";
import {trackAddToCart} from "modules/analytics/others/analytics.utils";
import {useDispatch} from "react-redux";
import {boardThunks} from "v2modules/board/stores/board.store";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const trackSource = {name: EVENT_SOURCE.FAVOURITES};
const ProductOptionsModal = useProductOptionsModal();
const SCREEN_WIDTH = Dimensions.get('window').width;

const SavedTabAllItems = (props) => {

    const {
        isLoadingSaved = true,
        wishlistItems = [],
        currencyCode = '',
        onLongPressItem = (image) => {},
        onPressOutItem = () => {},
    } = props;

    const dispatch = useDispatch();

    const renderItem = useCallback(({item}) => {

        const product = item.product;
        const isNotFound  = product?.isNotFound;

        const onPressRemove = () => {
            dispatch(boardThunks.removeFavouriteProduct(product));
        };


        const onPressItem = () => {
            RootNavigation.push(MainStackNavsConst.PRODUCT_DETAILS,
                {skeleton: product, trackSource});
        }


        const onPressAddToBag = () => {
            ProductOptionsModal.show(true, {
                skeleton: {...product, skeleton: true},
                onActionPress: onAddToBagAction,
                actionBtnText: I19n.t('أضف إلى السلة')
            });
        }


        const onAddToBagAction = (_item, variant, count) => {
            const cartItem = {
                productID: _item.id,
                variantID: variant?.id,
                quantity: count,
                product: {..._item, isSkeleton: true},
                variant: variant
            };

            dispatch(cartThunks.changeCartItem(cartItem));
            trackAddToCart(cartItem, trackSource);
            ProductOptionsModal.show(false);
        }

        const onLongPress = () => {
            onLongPressItem(product?.image);
        }

        const onPressOut = () => {
            onPressOutItem();
        }


        return (
            <Touchable onPress={onPressItem}
                       onLongPress={onLongPress}
                       onPressOut={onPressOut}
                       style={style.itemView}>
                <ImageWithBlur
                    style={style.imageImage}
                    resizeMode="cover"
                    resizeMethod="resize"
                    thumbnailUrl={refactorImageUrl(product?.image, 1)}
                    imageUrl={refactorImageUrl(product?.image, SCREEN_WIDTH * 0.48)}/>
                <View style={style.itemInfoView}>
                    {
                        (product.price) &&
                        <DzText style={style.itemPrice}>
                            {parseFloat(product.price) + ' ' + currencyCode}
                        </DzText>
                    }
                    <DzText style={style.itemName}>
                        {product.title}
                    </DzText>
                </View>
                <Touchable disabled={isNotFound} onPress={onPressAddToBag} style={[style.moveToBagBtn, isNotFound && {opacity: 0.8}]}>
                    <DzText style={style.moveToBagText}>
                        {I19n.t('إضافة إلى السلة')}
                    </DzText>
                </Touchable>
                <Touchable hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                           onPress={onPressRemove}
                           style={style.closeBtn}>
                    <CloseIcon
                        stroke={Colors.N_BLACK}
                        width={16}
                        height={16}/>
                </Touchable>
            </Touchable>
        )
    } ,[]);

    const keyExtractor = useCallback((item, index) => `${item.id || item.product?.id || index}`, []);

    const Separator = useCallback(() => {
        return (
            <Space directions={'h'} size={['md', '']}/>
        )
    }, []);

    return (
        <View style={style.container}>
            {
                (isLoadingSaved) &&
                <ActivityIndicator style={LayoutStyle.Flex} size="small" color={Colors.MAIN_COLOR}/>
            }
            {
                (!isLoadingSaved && wishlistItems.length === 0) &&
                    <View style={LayoutStyle.AlignItemsCenter}>
                        <Image style={style.emptyImage} source={EmptySavedIcon} />
                        <View style={style.emptySavedSpace} />
                        <DzText style={style.emptyText}>
                            {I19n.t("لا يوجد منتجات مفضلة حتى الآن")} {"\n"}
                        </DzText>
                        <DzText style={style.emptyText}>
                            {I19n.t("احفظ ما يعجبك من المنتجات وعُد لها في وقت لاحق هنا.")}
                        </DzText>
                    </View>
            }
            {
                (!isLoadingSaved && wishlistItems.length !== 0) &&
                    <>
                        <ProductOptionsModal.Modal/>
                        <FlatList data={wishlistItems}
                                  renderItem={renderItem}
                                  numColumns={2}
                                  windowSize={16}
                                  bounces={false}
                                  showsVerticalScrollIndicator={false}
                                  style={style.list}
                                  contentContainerStyle={style.listContents}
                                  columnWrapperStyle={style.listColumnWrapper}
                                  ItemSeparatorComponent={Separator}
                                  keyExtractor={keyExtractor}/>
                    </>
            }
        </View>
    );
}

export default SavedTabAllItems;
