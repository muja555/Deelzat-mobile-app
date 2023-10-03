import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    View,
    SafeAreaView,
    Platform,
    UIManager,
    FlatList,
    LayoutAnimation,
    ActivityIndicator
} from 'react-native';

import { bagContainerStyle as style } from './bag.container.style';
import {Colors, LayoutStyle} from "deelzat/style";
import {Button, Space} from "deelzat/ui";
import I19n, {isRTL} from "dz-I19n";
import {useDispatch, useSelector} from "react-redux";
import {cartSelectors, cartThunks} from "modules/cart/stores/cart/cart.store";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";
import {
    logAlgoliaEventProductClicked,
    trackChangeCartItemQuantity,
    trackRemoveCartItem, trackSaveProduct,
    trackViewCart
} from "modules/analytics/others/analytics.utils";
import ProductsDetailsGetInput from "modules/product/inputs/products-details-get.input";
import ProductApi from "modules/product/apis/product.api";
import {addProductsToCartItems, getTotalCartItemsPrice, isCheckableItem} from "modules/cart/others/cart.utils";
import * as Actions from "modules/cart/stores/cart/cart.actions";
import * as CheckoutActions from "v2modules/checkout/stores/checkout/checkout.actions";
import BagListItem from "v2modules/product/components/bag-list-item/bag-list-item.component";
import {boardThunks} from "v2modules/board/stores/board.store";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import Toast from "deelzat/toast";
import EmptyCartIcon from "assets/icons/EmptyCart.svg";
import EmptyCartTextEN from "assets/icons/EmptyCartText.svg";
import MainTabsNavsConst from "v2modules/main/constants/main-tabs-navs.const";
import {DzText} from "deelzat/v2-ui";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import ImagePreviewModalService from "v2modules/shared/modals/image-preview/image-preview.modal.service";
import GetCartItemsInput from "v2modules/product/inputs/cart/get-cart-items.input";
import CartApi from "v2modules/product/apis/cart.api";
import {setCartItems} from "modules/cart/stores/cart/cart.thunks";

const animConfig = {
    duration: 200,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
};
const trackSource = {name: EVENT_SOURCE.CART};
const BagContainer = (props) => {

    const {
        isFocused,
        onNext = () => {},
    } = props;

    const dispatch = useDispatch();
    const cartItems = useSelector(cartSelectors.cartItemsSelector);
    const cart = useSelector(cartSelectors.cartSelector);
    const currencyCode = useSelector(geoSelectors.currencyCodeSelector);
    const [isLoading, isLoadingSet] = useState(false);
    const isTracked = useRef(false);
    const [totalPrice, totalPriceSet] = useState(0);
    const [disableCheckout, disableCheckoutSet] = useState(false);


    useEffect(() => {

        if (Platform.OS === 'android' && !!UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        return () => {
            if (Platform.OS === 'android' && !!UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(false);
            }
        }
    }, []);


    const requestCartProducts = (productIDs = []) => {

        let _cartItems = [];
        const input = new ProductsDetailsGetInput();
        input.productIDs = productIDs.join(',');

        (async () => {

            try {

                const productList = await ProductApi.getListProductsDetails(input);
                _cartItems = addProductsToCartItems(cartItems, productList);
                totalPriceSet(getTotalCartItemsPrice(_cartItems));
                dispatch(Actions.SetCartItems([..._cartItems]));

            } catch (e) {
                console.warn(e);
            }

            if (!isTracked.current) {
                trackViewCart(_cartItems.filter(isCheckableItem));
                isTracked.current = true;
            }

            isLoadingSet(false);
        })();
    }


    useEffect(() => {

        // Update prices
        if (cart) {
            const input = new GetCartItemsInput();
            input.cartId = cart.id;
            CartApi.getCartItems(input)
                .then((_cartItems) => {

                    const getInt = (val) => val? parseInt(val): val;

                    _cartItems.forEach((cartItem) => {

                        const variantId = cartItem.variant_id;
                        const variants = cartItem.product?.variants;

                        if (cartItem.variant_id && !cartItem.variant) {
                            cartItem.variant = cartItem.product.variants?.find(_v => _v.id == cartItem.variant_id);
                        }

                        if (!cartItem.product) {
                            cartItem.product = {isNotFound: true};
                        }
                        else if (!variantId && variants.length > 0 && !getInt(variants[0].inventory_quantity)) {

                            cartItem.product.isNotFound = true;
                        }
                        else if ((!variantId && cartItem.product?.variants?.length > 0)
                            || (variantId && !cartItem.product?.variants?.length)) {
                            cartItem.product.isMissingVariant = true;
                        }
                        else if (variantId && !getInt(cartItem.variant?.inventory_quantity)) {
                            cartItem.product.isNotFound = true;
                        }

                    });

                    dispatch(setCartItems(_cartItems));
                })
                .catch(console.warn);

        } else {

            let missingProductIDs = cartItems.map(cartItem => cartItem.productID);
            uniqWith(missingProductIDs, isEqual);
            requestCartProducts(missingProductIDs);
        }

    }, [cart]);


    useEffect(() => {

        totalPriceSet(getTotalCartItemsPrice(cartItems));

        const checkableItems = cartItems.filter(isCheckableItem);
        disableCheckoutSet(checkableItems.length === 0);

        if (!isTracked.current) {
            trackViewCart(checkableItems);
            isTracked.current = true;
        }

    }, [cartItems]);


    const onPressProduct = useCallback((product, index, preSelectedVariantID) => {
        RootNavigation.push(MainStackNavsConst.PRODUCT_DETAILS, {
            skeleton: product,
            preSelectedVariantID,
            trackSource
        });

        logAlgoliaEventProductClicked(product, index);
    }, []);


    const onPressMoveToSave = useCallback((item) => {
        LayoutAnimation.configureNext({
            update: animConfig,
            delete: animConfig,
        });

        dispatch(boardThunks.addFavouriteProduct(item.product));
        Toast.success(I19n.t('تم إضافة المنتج للمفضلة'), require('assets/icons/DUMMY.png'));
        trackSaveProduct(item.product, {name: EVENT_SOURCE.CART}, item.variant);

        // remove from cart
        dispatch(cartThunks.changeCartItem({...item, quantity: 0, showToast: false}));
        trackRemoveCartItem(item);
    }, []);


    const renderItem = useCallback(({item, index}) => {
        const onPress = () => onPressProduct(item?.product, index, item?.variantID);
        const onChangeQuantity = (diff) => {
            LayoutAnimation.configureNext({
                update: animConfig,
                delete: animConfig,
            });

            dispatch(cartThunks.changeCartItem({...item, quantity: diff, showToast: false}));
            if (diff === 0) {
                trackRemoveCartItem(item);
            }
            else {
                trackChangeCartItemQuantity(item, diff + item.quantity);
            }
        };


        const onLongPressItem = () => {
            ImagePreviewModalService.setVisible({
                show: true,
                imageUrl: item?.product?.image
            });
        };

        const onPressOutItem = () => {
            ImagePreviewModalService.setVisible({
                show: false
            });
        }

        return (
            <BagListItem
                cartItem={item}
                onProductPress={onPress}
                onLongPress={onLongPressItem}
                onPressOut={onPressOutItem}
                onMoveToSavePress={onPressMoveToSave}
                currencyCode={currencyCode}
                onChangeQuantity={onChangeQuantity}/>
        )
    }, []);


    const renderSeparator = useCallback(() => {
        return (
            <Space directions={'h'} size={'md'}/>
        )
    }, []);


    const keyExtractor = useCallback((item, index) => {
        return `${item.productID}_${item.variantID}_${index}`;
    }, []);


    const onPressBrowse = () => {
        RootNavigation.navigate(MainTabsNavsConst.BROWSE);
    }


    const renderEmptyView = (
        <View style={[LayoutStyle.Flex, LayoutStyle.JustifyContentCenter, LayoutStyle.AlignItemsCenter]}>
            <View style={LayoutStyle.Flex} />
            <View style={[LayoutStyle.JustifyContentCenter, LayoutStyle.AlignItemsCenter]}>
                <EmptyCartIcon
                    width={200}
                    height={200}/>
                <View style={style.space46}/>
                {
                    (!isRTL()) &&
                    <EmptyCartTextEN width={248} height={22} />
                }
                {
                    (isRTL()) &&
                    <DzText style={style.emptyTextBig}>
                        السلة فارغة !
                    </DzText>
                }
                <View style={style.space46}/>
                <DzText style={style.emptyTextSmall}>
                    {I19n.t('ما تقلق، إبدأ بالشراء وإملاء سلتك بمنتجات مختلفة مما تتمنى، وممكن كمان شوية هدايا') + " " + '😉'}
                </DzText>
            </View>
            <View style={LayoutStyle.Flex} />
            <View style={{width: '100%'}}>
                <Button
                    btnStyle={style.btnStyle}
                    textStyle={style.btnText}
                    onPress={onPressBrowse}
                    text={I19n.t('إبدأ بالتسوق')}/>
            </View>
            <Space directions={'h'} size={'md'} />
        </View>
    );


    const onCheckoutPress = () => {

        dispatch(CheckoutActions.SetData({
            clearCartOnSuccess: true,
            cartId: cart?.id,
            checkoutItems: cartItems.filter(isCheckableItem),
            trackSource
        }));

        onNext();
    }


    const ListHeaderComponent = useCallback(() => {
        return (
            <View style={{height: 10}}/>
        )
    }, []);


    if (!isFocused) {
        return <View style={style.container}/>
    }

    return (
        <View style={style.container}>
            <Space directions={'h'} size={'lg'} />
            {
                (isLoading) &&
                <ActivityIndicator style={style.loadingView} size="small" color={Colors.MAIN_COLOR}/>
            }
            {
                (!isLoading && cartItems.length > 0) &&
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    ListHeaderComponent={ListHeaderComponent}
                    ItemSeparatorComponent={renderSeparator}
                    showsVerticalScrollIndicator={false}/>
            }
            {
                (!isLoading && cartItems.length > 0) &&
                <View>
                    <Space directions={'h'} size={'md'} />
                    <DzText style={style.summaryTitle}>
                        {I19n.t('فاتورة المشتريات')}
                    </DzText>
                    <Space directions={'h'} size={['md', '']}/>
                    <View style={LayoutStyle.Row}>
                        <DzText style={style.subTotal}>
                            {I19n.t('المجموع قبل التوصيل')}
                        </DzText>
                        <DzText style={style.price}>
                            {totalPrice + ' ' + currencyCode}
                        </DzText>
                    </View>
                    <Space directions={'h'} size={['md', '']}/>
                    <Button
                        disabled={disableCheckout}
                        btnStyle={style.btnStyle}
                        textStyle={style.btnText}
                        onPress={onCheckoutPress}
                        text={I19n.t('الشراء الآن')}/>
                    <Space directions={'h'} size={'md'} />
                </View>
            }
            {
                (!isLoading && !cartItems.length) &&
                    <>
                        {renderEmptyView}
                    </>
            }
        </View>
    );
};

export default BagContainer;
