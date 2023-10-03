import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Dimensions,
    Animated,
    SafeAreaView,
    ScrollView,
    Image,
    Platform, PanResponder
} from 'react-native';

import { productDetailsContainerStyle as style } from './product-details.container.style';
import ProductImagesCarousel from "v2modules/product/components/product-images-carousel/product-images-carousel.component";
import ProductApi from "modules/product/apis/product.api";
import ProductDetailsGetInput from "modules/product/inputs/product-details-get.input";
import {
    logAlgoliaEventProductViewed, trackAddToCart, trackClickOnContactSeller, trackClickOnRecommendedItem,
    trackShareProduct,
    trackViewProduct
} from "modules/analytics/others/analytics.utils";
import {prepareProduct} from "modules/product/others/product-details.utils";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import {Colors, Font, LayoutStyle, LocalizedLayout, Spacing} from "deelzat/style";
import BackSvg from "assets/icons/BackIcon.svg";
import ShareIcon from "assets/icons/Share2.svg";
import BagIcon from 'assets/icons/BagIcon.svg';
import IconButton from "deelzat/v2-ui/icon-button";
import {useIsFocused} from "@react-navigation/native";
import BookmarkButton from "v2modules/board/components/bookmark-button/bookmark-button.component";
import {wishlistItemsSelector} from "v2modules/board/stores/board.selectors";
import {useDispatch, useSelector} from "react-redux";
import I19n, {isRTL} from "dz-I19n";
import ProductQuantityControl from "v2modules/product/components/product-quantity-control/product-quantity-control.component";
import {DzText, SelectValueGrid, Touchable} from "deelzat/v2-ui";
import ColorsPalette from "v2modules/shared/components/colors-palette/colors-palette.component";
import ShopImage from "v2modules/shop/components/shop-image/shop-image.component";
import ChatIcon from "assets/icons/Chat2.svg"
import {createDynamicLink, shareText} from "modules/main/others/main-utils";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import Spinner from "react-native-loading-spinner-overlay";
import MoreVertical from "assets/icons/MoreVertical.svg";
import useActionSheetModal from "v2modules/shared/modals/action-sheet/action-sheet.modal";
import useReportModal from "v2modules/shared/modals/report/report.modal";
import {routeToChatRoom, routeToShop} from "modules/root/components/deeplinks-router/deeplinks-router.utils";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import {cartSelectors, cartThunks} from "modules/cart/stores/cart/cart.store";
import Clipboard from "@react-native-clipboard/clipboard";
import WillShowToast from "deelzat/toast/will-show-toast";
import { BlurView } from "@react-native-community/blur";
import RecommendedList from "v2modules/product/components/recommended-list/recommended-list.component";
import Gradient from "assets/icons/GradientMainColor.png";
import recommend from "@algolia/recommend";
import Keys from "environments/keys";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";
const recommendClient = recommend(Keys.Algolia.appId, Keys.Algolia.apiKey);
import {useRecommendations} from "@algolia/recommend-react";
import AlgoliaIndicesConst from "modules/main/constants/algolia-indices.const";
import {ExpandableText} from "deelzat/v2-ui";
import {useSafeAreaInsets} from "react-native-safe-area-context";
const ActionSheetModal = useActionSheetModal();
const ReportModal = useReportModal();
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import * as CheckoutActions from 'v2modules/checkout/stores/checkout/checkout.actions';
import CheckoutStepsConst from 'v2modules/checkout/constants/checkout-steps.const';
import {
    CAROUSEL_HEIGHT,
    CAROUSEL_WIDTH, CONTENT_OFFSET, FULL_SCREEN_TOP_MARGIN,
    SCREEN_HEIGHT,
} from 'v2modules/product/containers/product-details/product-details.container.const';
import Toast from 'deelzat/toast';

const mainTopBtnColor = '#000';
const invertedColor = Colors.invert(mainTopBtnColor);
const btnStyle = [
    style.iconBtn,
    {backgroundColor: Colors.alpha(invertedColor, 0.3)},
    {borderColor: Colors.alpha(mainTopBtnColor, 0.2)}
];


const ProductDetailsShopInfo = (props) => {
    const  {
        shop,
        onPressProfile = () => {},
        onPressContactSeller = () => {},
    } = props;

    return (
        <View>
            <Space directions={'h'} size={'md'}/>
            <Space directions={'h'}/>
            <DzText style={style.infoLabel}>
                {I19n.t('تفاصيل البائع')}
            </DzText>
            <Space directions={'h'} size={'md'}/>
            <Space directions={'h'}/>
            <View style={style.shopInfo}>
                <Touchable onPress={onPressProfile}
                           style={style.touchableShopInfo}>
                    <ShopImage image={shop?.picture}
                               style={style.shopImage}/>
                    <Space directions={'v'} size={'md'}/>
                    <View style={{maxWidth: '80%'}}>
                        <DzText style={[style.shopNameInfo, LocalizedLayout.TextAlign(true)]}>
                            {shop?.name}
                        </DzText>
                        {
                            (!!shop?.address?.city) &&
                            <DzText style={[style.shopCityInfo, LocalizedLayout.TextAlign(true)]}>
                                {shop.address.city}
                            </DzText>
                        }
                    </View>
                </Touchable>
                <Touchable style={style.chatBtn} onPress={onPressContactSeller}>
                    <ChatIcon width={24}
                              heigh={24}
                              strokeWidth={1}
                              stroke={Colors.MAIN_COLOR}/>
                </Touchable>
            </View>
        </View>
    )
}



const ProductDetailsDescription = (props) => {
    const {
        description,
    } = props;


    const onDescLongPress = () => {
        Clipboard.setString(description);
        Toast.info(I19n.t('تم النسخ'));
    }


    return (
        <>
            <Space directions={'h'} size={'md'}/>
            <Space directions={'h'}/>
            <Touchable activeOpacity={1} onLongPress={onDescLongPress}>
                <View style={LayoutStyle.Row}>
                    <DzText style={style.infoLabel}>
                        {I19n.t('تفاصيل المنتج')}
                    </DzText>
                    <Touchable onPress={ActionSheetModal.show}>
                        <MoreVertical fill={Colors.Gray500} width={24} height={24}/>
                    </Touchable>
                </View>
            </Touchable>
            <Space directions={'h'} size={'sm'}/>
            <View style={style.verticalLine} />
            <Space directions={'h'} size={'md'}/>
            <ExpandableText text={description}
                            copyOnLongPress={true}
                            minimumLines={3}/>
        </>
    )
}


const ProductDetailsOptions = (props) => {
    const {
        isLoading,
        sizeOptions,
        colorOptions,
        selectedQuantity,
        inventoryQuantity,
        displayQuantityControl,
        onChangeCount = (newCount) => {},
        selectedSize,
        selectedColor,
        highlightSizeError,
        highlightColorError,
        onSizeOptionPress,
        onColorOptionPress
    } = props;

    return (
        <View>
            <View style={style.rowSpaceBetween}>
                <View/>
                {
                    (displayQuantityControl) &&
                    <ProductQuantityControl value={selectedQuantity} onChange={onChangeCount} max={inventoryQuantity}/>
                }
                {
                    (!displayQuantityControl && !isLoading) &&
                    <DzText style={[
                        style.soldOutText,
                        LocalizedLayout.TextAlign(isRTL()),
                    ]}>
                        {I19n.t('نفذت الكمية')}
                    </DzText>
                }
            </View>
            <View style={sizeOptions.length > 0 && style.optionsViewTopMargin}>
                {
                    (sizeOptions.length > 0) &&
                    <View>
                        <Space directions={'h'} size={'md'} />
                        <DzText style={[style.optionLabel, highlightSizeError && style.labelHighlight]}>
                            {I19n.t('اختر المقاس')}
                        </DzText>
                        <Space directions={'h'} size={'md'} />
                        <SelectValueGrid multi={false}
                                         keyBy={'value'}
                                         labelBy={'title'}
                                         options={sizeOptions}
                                         selectedStyle={style.selectedSize}
                                         value={selectedSize? [selectedSize] : []}
                                         onChange={onSizeOptionPress}/>
                    </View>
                }
                {
                    (sizeOptions.length > 0 && colorOptions.length > 0) &&
                    <Space directions={'h'}/>
                }
                {
                    (sizeOptions.length === 0 && colorOptions.length > 0) &&
                    <Space directions={'h'}/>
                }
                {
                    (colorOptions.length > 0) &&
                    <View style={style.colorOptions}>
                        <DzText style={[style.optionLabel, highlightColorError && style.labelHighlight]}>
                            {I19n.t('اختر لون')}
                        </DzText>
                        <Space directions={'v'} size={'md'}/>
                        <View style={{flexShrink: 1}}>
                            <ColorsPalette multi={false}
                                           colors={colorOptions}
                                           selected={selectedColor? [selectedColor] : []}
                                           onChange={onColorOptionPress}/>
                        </View>
                    </View>
                }
            </View>
        </View>
    )
}


const ProductDetailsContainer = (props) => {
    const {
        skeleton = {},
        preSelectedVariantID,
        trackSource,
    } = props.route.params;

    const currencyCode = useSelector(geoSelectors.currencyCodeSelector);
    const dispatch = useDispatch();
    const wishlistItems = useSelector(wishlistItemsSelector);
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    const [product, productSet] = useState(prepareProduct({...skeleton, isLoading: true}, skeleton));

    const {recommendations} = useRecommendations({
        indexName: AlgoliaIndicesConst.PRODUCTS,
        objectIDs: !!product.algolia_object_id? [product.algolia_object_id]: [],
        maxRecommendations: 30,
        model: 'related-products',
        recommendClient,
    });

    const [isFavourite, isFavouriteSet] = useState(false);
    const [colorOptions, colorOptionsSet] = useState([]);
    const [sizeOptions, sizeOptionsSet] = useState([]);
    const cartItems = useSelector(cartSelectors.cartItemsSelector);

    const [selectedVariant, selectedVariantSet] = useState();
    const [selectedColor, selectedColorSet] = useState();
    const [selectedSize, selectedSizeSet] = useState();
    const [selectedCount, selectedCountSet] = useState(1);

    const [highlightColorError, highlightColorErrorSet] = useState(false);
    const [highlightSizeError, highlightSizeErrorSet] = useState(false);
    const [showFullLoader, showFullLoaderSet] = useState(false);

    const productImages = useMemo(() => {
        if (product?.images) {
            const SHOULD_REVERSE = Platform.OS === 'android' && isRTL();
            let _images = product?.images.length > 8? product.images.slice(0, 8): product.images;
            return  SHOULD_REVERSE? _images.reverse() : _images;

        }
    }, [product?.images]);

    const thisTrackSource = {
        name: EVENT_SOURCE.PRODUCT_SCREEN,
        attr1: product?.id,
        attr2: product?.title,
    };

    const isAnimatingRef = useRef(false);
    const [isAnimating, isAnimatingSet] = useState(false);
    const isFullScreen = useRef(false);
    const [isFullScreenState, isFullScreenStateSet] = useState(false);
    const [actualContentHeight, actualContentHeightSet] = useState(0);
    const [scrollableHeight, scrollableHeightSet] = useState(CAROUSEL_HEIGHT);
    const miniModeHeight = useRef(SCREEN_HEIGHT - CAROUSEL_HEIGHT + CONTENT_OFFSET);
    const fullModeHeight = useRef(SCREEN_HEIGHT - FULL_SCREEN_TOP_MARGIN);
    const tabsTranslateYAnim = useRef(new Animated.Value(SCREEN_HEIGHT - miniModeHeight.current)).current;
    const blurOpacity = useRef(new Animated.Value(0)).current;
    const deliveryBannerOpacity = useRef(new Animated.Value(0)).current;
    const carouselY = useRef(new Animated.Value(0)).current;
    const enableChangeMode = useRef(false);
    const isFocusedRef = useRef(true);
    const [scrollY, scrollYSet] = useState(0);

    const scrollViewRef = useRef();


    const onScroll = useCallback(({nativeEvent: {contentOffset: {y: offset}}}) => {
        if ( scrollY === 2 && offset === 0) {
            changeFullScreenMode(false, true)
        }
        scrollYSet(offset);
    }, [scrollY]);

    useEffect(() => {
        isFocusedRef.current = isFocused;
    }, [isFocused]);


    /**
     * @param newMode new val for isFullScreen
     */
    const changeFullScreenMode = (newMode, animated) => {

        if (!enableChangeMode.current || isAnimatingRef.current)
            return;

        if (animated) {
            isAnimatingRef.current = true;
            isAnimatingSet(true);

            setTimeout(() => {
                isAnimatingRef.current = false;
                isAnimatingSet(false);
            }, 300);
        }


        isFullScreen.current = newMode;
        isFullScreenStateSet(newMode);

        Animated.parallel([
            Animated.timing(blurOpacity, {
                toValue: newMode? 1: 0,
                duration: animated? 300: 0,
                useNativeDriver: true
            }),
            Animated.timing(carouselY, {
                toValue: newMode? -10: 0,
                duration: animated? 300: 0,
                useNativeDriver: true,
                bounciness: 5,
                speed: 3,
            }),
            Animated.spring(tabsTranslateYAnim, {
                toValue: SCREEN_HEIGHT - (newMode? fullModeHeight.current:  miniModeHeight.current),
                duration: animated? 300: 0,
                useNativeDriver: true,
                bounciness: 10,
                speed: 3,
            })
        ]).start();

        if (newMode) { // is full screen mode

            if (actualContentHeight >= fullModeHeight.current) {
                scrollViewRef.current?.scrollTo({x: 0, y: 2, animated: false});
            }

            scrollableHeightSet(fullModeHeight.current);
        }
        else {
            setTimeout(() => {
                scrollableHeightSet(miniModeHeight.current);
            }, Platform.OS === 'ios'? 300: 0);
        }
    }


    const onContentLayout = useCallback((e) => {
        const height = e.nativeEvent.layout.height;

        if (height > miniModeHeight.current) {
            enableChangeMode.current = true;
        }

        actualContentHeightSet(height);
    }, []);


    const checkSelectedOptionsStatus = () => {
        const hasColors = !!product.UIOptionsColor?.length;
        const hasSizes = !!product?.UIOptionsSize?.length;
        const isValidColorSelection = (hasColors && !!selectedColor) || (!hasColors);
        const isValidSizeSelection = (hasSizes && !!selectedSize) || (!hasSizes);

        if (!isValidColorSelection) {
            highlightColorErrorSet(true);
        }


        if (!isValidSizeSelection) {
            highlightSizeErrorSet(true);
        }


        if (!isValidColorSelection || !isValidSizeSelection)
            return {isValid: false}

        return {isValid: true, variant: selectedVariant}
    }


    const onTitleLongPress = () => {
        Clipboard.setString(product.title);
        Toast.info(I19n.t('تم النسخ'));

    }


    const onPressCheckout = () => {
        const {isValid, variant} = checkSelectedOptionsStatus();

        if (isValid) {
            dispatch(CheckoutActions.SetData({
                clearCartOnSuccess: false,
                checkoutItems: [{
                    productID: product.id,
                    variantID: variant?.id,
                    quantity: selectedCount,
                    product: product,
                    variant: variant
                }],
                trackSource
            }));
            RootNavigation.push(MainStackNavsConst.CHECKOUT, {initialStep: CheckoutStepsConst.INFO});
        }
    }


    const onPressAddToCart = () => {
        const {isValid, variant} = checkSelectedOptionsStatus();

        if (isValid) {
            const cartItem = {
                productID: product.id,
                variantID: variant?.id,
                quantity: selectedCount,
                product: {...product, isSkeleton: true},
                variant: variant
            };
            dispatch(cartThunks.changeCartItem(cartItem));
            trackAddToCart(cartItem, thisTrackSource);
        }
    }


    const onPressContactSeller = useCallback(() => {

        const shopAuthId = product.shop?.shop_auth_id?.length && product.shop.shop_auth_id[0];
        routeToChatRoom({
            toUserId: shopAuthId,
            shop: product.shop,
            draftImageUrl: product.image
        }, thisTrackSource);

        trackClickOnContactSeller(product);
    }, [product]);


    const onPressProfile = useCallback(()=> {
        routeToShop(product.shop, product, thisTrackSource);
    }, [product])


    useEffect(() => {
        const _isFavourite = !!wishlistItems.find(item => item.product?.id === product.id);
        isFavouriteSet(_isFavourite);
    }, [wishlistItems]);

    useEffect(() => {
        const inputs = new ProductDetailsGetInput();
        inputs.productID = product.id + "";
        ProductApi.getProductDetails(inputs, true)
            .then((result) => {
                const _product = prepareProduct(result, product);
                productSet(_product);
                logAlgoliaEventProductViewed(_product);
            })
            .catch((e) => {
                productSet({
                    ...product,
                    isLoading: false,
                    isNotFound: true,
                })
            })
    }, []);

    // Prepare product for display
    useEffect(() => {
        const showDeliveryBanner = !product.isLoading && !product.isNotFound;
        Animated.timing(deliveryBannerOpacity, {
            toValue: showDeliveryBanner? 1: 0,
            duration: showDeliveryBanner? 200: 0,
            useNativeDriver: true
        }).start();

        if (product && !product.isLoading) {
            trackViewProduct(product, trackSource);
            const sizeOptions = (product.UIOptionsSize ?? []).map(op => ({...op, disabled: product.isLoading || product.isNotFound || op.disabled}));
            sizeOptionsSet(sizeOptions);
            const colorOptions = (product.UIOptionsColor ?? []).map(op => ({...op, disabled: product.isLoading || product.isNotFound || op.disabled}));
            colorOptionsSet(colorOptions);

            // Set already selected variant from props
            if (preSelectedVariantID && product?.variants?.length && (sizeOptions?.length || colorOptions?.length )) {
                product.variants.forEach((variant) => {
                    if (variant?.id == preSelectedVariantID) {
                        sizeOptions.forEach((sizeOption) => {
                            if (sizeOption.value === variant.option2) {
                                selectedSizeSet(sizeOption);
                                return;
                            }
                        });

                        colorOptions.forEach((colorOption) => {
                            if (colorOption.title === variant.option1) {
                                selectedColorSet(colorOption);
                                return;
                            }
                        });

                        return;
                    }
                });
            }
        }
    }, [product]);


    // Auto select if there are one variant to select
    useEffect(() => {
        if ((colorOptions?.length === 1 && sizeOptions?.length <= 1)
            || (colorOptions?.length <= 1 && sizeOptions?.length === 1)) {

            if (colorOptions.length === 1) {
                selectedColorSet(colorOptions[0]);
            }

            if (sizeOptions.length === 1) {
                selectedSizeSet(sizeOptions[0]);
            }
        }
    }, [colorOptions, sizeOptions]);


    // On select size, enable only options that includes this value
    useEffect(() => {
        if (selectedColor?.disabled) {
            selectedColorSet()
        }
        if (colorOptions.length) {
            const sizeVariants = product.variants?.filter(variant => !selectedSize || variant.option2 === selectedSize.value);
            const _colorOptions = colorOptions.map(color => {
                let colorExistsInVariants = false;
                sizeVariants?.forEach(variant => {
                    if (variant.option1 === color.title) {
                        colorExistsInVariants = true;
                    }
                })
                color.disabled = !colorExistsInVariants;
                return color;
            });
            colorOptionsSet(_colorOptions)
        }
    }, [selectedSize]);


    // On select color, enable only options that includes this value
    useEffect(() => {
        if (selectedSize?.disabled) {
            selectedSizeSet()
        }
        if (sizeOptions.length) {
            const colorVariants = product.variants?.filter(variant => !selectedColor || variant.option1 === selectedColor.title);
            const _sizeOptions = sizeOptions.map(size => {
                let sizeExistsInVariants = false;
                colorVariants?.forEach(variant => {
                    if (variant.option2 === size.value) {
                        sizeExistsInVariants = true;
                    }
                })
                size.disabled = !sizeExistsInVariants || product.isLoading || product.isNotFound;
                return size;
            });
            sizeOptionsSet(_sizeOptions);
        }
    }, [selectedColor]);


    // Update selected variant based on selected options
    useEffect(() => {
        let _selectedVariant = undefined;
        product?.variants?.forEach(variant => {

            if (variant.option1 === selectedColor?.title) {
                if (variant.option2 === selectedSize?.value) {
                    _selectedVariant = variant
                }
                // in case of 'no-size' text was in variants
                else if (!product.UIOptionsSize?.length && (variant.option2 === 'no-size' || !variant.option2)) {
                    _selectedVariant = variant
                }
            }
        })
        selectedVariantSet(_selectedVariant);
        if (!!_selectedVariant && selectedCount > _selectedVariant.inventory_quantity) {
            selectedCountSet(_selectedVariant?.inventory_quantity)
        }
    }, [selectedColor, selectedSize]);


    const isDeliveryAvailable = product.is_soldable === undefined || product.is_soldable === true;
    const price = parseFloat((selectedVariant ?? product)['price']);
    const compareAtPrice = parseFloat((selectedVariant ?? product)['compare_at_price']);
    const inventoryQuantity = parseFloat((selectedVariant ?? product)['inventory_quantity']);
    const displayQuantityControl = !product.isNotFound && inventoryQuantity > 0;
    const isDiscount = product.compare_at_price > product.price;

    const renderNameAndPrices = (
        <View style={style.titleRow}>
            {
                (product.title) &&
                <View style={LayoutStyle.Flex}>
                    <Touchable activeOpacity={1} onLongPress={onTitleLongPress}>
                        <DzText style={[style.productTitle, LocalizedLayout.TextAlign(isRTL())]}>
                            {product.title}
                        </DzText>
                    </Touchable>
                    <Touchable onPress={onPressProfile}>
                        <DzText style={style.shopName}>
                            {product.shop?.name}
                        </DzText>
                    </Touchable>
                </View>
            }
            {
                (!product.isNotFound && !!price) &&
                <View>
                    {
                        (isDiscount) &&
                        <DzText style={style.compareAtPrice}>
                            {`${compareAtPrice} ${currencyCode}`}
                        </DzText>
                    }
                    <DzText style={[style.price,
                        isDiscount && style.priceDiscount]}>
                        {`${price} ${currencyCode}`}
                    </DzText>
                </View>
            }
        </View>
    );


    const onSizeOptionPress = useCallback((values) => {
        highlightSizeErrorSet(false);
        selectedSizeSet(values.length? values[0] : undefined)
    }, []);


    const onColorOptionPress = useCallback((values) => {
        highlightColorErrorSet(false);
        selectedColorSet(values.length? values[0] : undefined);
    }, []);


    const onPressShare = () => {
        showFullLoaderSet(true);
        (async () => {
            try {
                const dynamicLink = await createDynamicLink('product', product.id, {
                    title: product.title,
                    imageUrl: product.image,
                    descriptionText: product.title,
                });
                await shareText(dynamicLink, `${I19n.t('شارك')} ${product.title}`);
                trackShareProduct(product, thisTrackSource);
            }
            catch (e) {
                console.error(e);
            }
            showFullLoaderSet(false);
        })();
    }


    const onPressReport = () => {
        ActionSheetModal.show(false);
        ReportModal.show(true);

    }


    const onPressCart = () => {
        RootNavigation.push(MainStackNavsConst.CHECKOUT);
    }


    const onPressRecommended = useCallback((item, index) => {

        trackClickOnRecommendedItem(item, index, product);
        RootNavigation.push(MainStackNavsConst.PRODUCT_DETAILS, {
            skeleton: item,
            trackSource: {
                name: EVENT_SOURCE.RECOMMENDED,
                attr1: product.id,
                index: index
            }});

    }, [product.id]);


    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => {
            return (isFocused && !isAnimating)
                && (!isFullScreen.current || (isFullScreen.current && scrollY <= 0));
        },
        onPanResponderMove: (evt, gestureState) => {

            // ignore what will count as click events
            if (Math.abs(gestureState.dy) < 2)
                return;

            if (!isFullScreen.current && gestureState.dy < 0) { // pull up

                changeFullScreenMode(true, true);
            }
            else if (isFullScreenState
                && scrollY <= 0
                && gestureState.dy > 0) {  // pull down

                changeFullScreenMode(false, true);
            }

        },
        onPanResponderRelease: (evt, gestureState) => {

        }
    });

    const blurViewStyle = useMemo(() => ({
        position: 'absolute',
        width: CAROUSEL_WIDTH,
        height: CAROUSEL_HEIGHT - 30,
    }), []);


    return (
        <View style={style.container}>
            <WillShowToast id={'add-to-cart-product-details'}/>
            <Spinner visible={showFullLoader}
                     textContent={''}
                     animation={'fade'}/>
            <ActionSheetModal.Modal
                onHide={() => {ActionSheetModal.show(false)}}>
                <View>
                    <Button
                        btnStyle={style.actionSheetButton}
                        textStyle={Font.Bold}
                        onPress={onPressReport}
                        size={ButtonOptions.Size.LG}
                        text={I19n.t('إبلاغ عن المنتج')}/>
                </View>
            </ActionSheetModal.Modal>
            <ReportModal.Modal itemId={product.id}/>
            <Animated.View style={{transform: [{translateY: carouselY}]}}>
                <ProductImagesCarousel isLoading={product.isLoading}
                                       productImage={product?.image}
                                       images={productImages} />
                <Animated.View pointerEvents="none" style={[style.blurView, {opacity: blurOpacity}]}>
                    <BlurView
                        style={blurViewStyle}
                        blurType="light"
                        blurAmount={32}
                        downsampleFactor={25}
                        reducedTransparencyFallbackColor="white" />
                </Animated.View>
            </Animated.View>
            {
                // Action buttons,
                (!product.isLoading && !product.isNotFound) &&
                <View style={style.actionButtonsView}>
                    {
                        (isDeliveryAvailable) &&
                        <>
                            <Touchable onPress={onPressAddToCart}
                                       disabled={!displayQuantityControl}
                                       style={[style.addToBagBtn, !displayQuantityControl && {opacity: 0.6}, {marginBottom: insets.bottom}]}>
                                <DzText style={style.addToBagText}>
                                    {I19n.t('إضافة إلى السلة')}
                                </DzText>
                            </Touchable>
                            <Space directions={'v'} size={'md'}/>
                            <Space directions={'v'}/>
                            <Touchable onPress={onPressCheckout}
                                       disabled={!displayQuantityControl}
                                       style={[style.buyBtn, !displayQuantityControl && {opacity: 0.6}, {marginBottom: insets.bottom}]}>
                                <DzText style={style.buyText}>
                                    {I19n.t('شراء')}
                                </DzText>
                            </Touchable>
                        </>
                    }
                    {
                        (!isDeliveryAvailable) &&
                        <Touchable onPress={onPressContactSeller}
                                   style={[style.buyBtn, !displayQuantityControl && {opacity: 0.6}, {marginBottom: insets.bottom}]}>
                            <View style={LayoutStyle.Row}>
                                <DzText style={style.buyText}>
                                    {I19n.t('تواصل مع') + " " + (product?.shop?.name || product?.vendor || 'البائع')}
                                </DzText>
                                <Space directions={'v'} size={'md'}/>
                                <ChatIcon width={24}
                                          heigh={24}
                                          strokeWidth={1}
                                          stroke={'#fff'}/>
                            </View>
                        </Touchable>
                    }
                </View>
            }
            {/* Product details contents*/}
            <Animated.View
                {...panResponder.panHandlers}
                style={[style.contents, {
                    transform: [{translateY: tabsTranslateYAnim}],
                    height: scrollableHeight
                }]}>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={style.scrollView}
                    scrollEventThrottle={10}
                    onScroll={onScroll}
                    fadingEdgeLength={0}
                    scrollEnabled={isFullScreenState && !isAnimating}
                    bounces={false}
                    showsVerticalScrollIndicator={false}>
                    <View style={style.content}
                          onLayout={onContentLayout}>
                        <Image source={Gradient} resizeMethod={'scale'} style={style.gradientView}/>
                        <Space directions={'h'}/>
                        <Animated.View style={[
                            style.deliveryInfo,
                            !isDeliveryAvailable && style.notDeliveryInfo,
                            {opacity: deliveryBannerOpacity}]}>
                            <DzText style={style.deliveryText}>
                                {I19n.t(isDeliveryAvailable ?
                                    'سيتم التوصيل عن طريق ديلزات' :
                                    'تواصل مع البائع عبر الرسائل لشراء هذا المنتج')}
                            </DzText>
                        </Animated.View>
                        <Space directions={'h'}/>
                        <Space directions={'h'} size={'md'}/>
                        <View style={Spacing.HorizontalPadding}>
                            {renderNameAndPrices}
                            <Space directions={'h'}/>
                            <ProductDetailsOptions isLoading={product.isLoading}
                                                   sizeOptions={sizeOptions}
                                                   colorOptions={colorOptions}
                                                   selectedSize={selectedSize}
                                                   selectedColor={selectedColor}
                                                   selectedQuantity={selectedCount}
                                                   highlightSizeError={highlightSizeError}
                                                   highlightColorError={highlightColorError}
                                                   inventoryQuantity={inventoryQuantity}
                                                   displayQuantityControl={displayQuantityControl}
                                                   onChangeCount={selectedCountSet}
                                                   onSizeOptionPress={onSizeOptionPress}
                                                   onColorOptionPress={onColorOptionPress}
                            />
                            {
                                (!!product.body_html) &&
                                <ProductDetailsDescription description={product.body_html} />
                            }
                            {
                                (!!product.shop && !product.isLoading) &&
                                <ProductDetailsShopInfo shop={product.shop}
                                                        onPressProfile={onPressProfile}
                                                        onPressContactSeller={onPressContactSeller}
                                />
                            }
                        </View>
                        {
                            (!!product.algolia_object_id) &&
                            <>
                                <RecommendedList recommendations={recommendations}
                                                 currencyCode={currencyCode}
                                                 onPressItem={onPressRecommended} />
                                <Space directions={'h'} size={'lg'} />
                            </>

                        }
                    </View>
                </ScrollView>
            </Animated.View>

            {/*Top header buttons*/}
            <View style={[style.header, {paddingTop: insets.top}]}>
                <Space directions={'h'} size={'md'} />
                <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                    <IconButton onPress={RootNavigation.goBack}
                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                btnStyle={[style.backButton, LocalizedLayout.ScaleX(), btnStyle]}
                                type={ButtonOptions.Type.MUTED_OUTLINE}>
                        <BackSvg stroke={'#000'} width={24} height={24}/>
                    </IconButton>
                    <View style={LayoutStyle.Flex}/>
                    <IconButton onPress={onPressShare} btnStyle={btnStyle} type={ButtonOptions.Type.MUTED_OUTLINE}>
                        <ShareIcon stroke={mainTopBtnColor} fill={Colors.N_BLACK} width={24} height={24}/>
                    </IconButton>
                    <Space directions={'v'} size={'md'}/>
                    <IconButton btnStyle={[btnStyle, isFavourite && style.bookmarkChecked]} type={ButtonOptions.Type.MUTED_OUTLINE}>
                        <BookmarkButton width={24}
                                        height={24}
                                        color={mainTopBtnColor}
                                        trackSource={thisTrackSource}
                                        product={product}/>
                    </IconButton>
                    <Space directions={'v'} size={'md'}/>
                    <IconButton onPress={onPressCart} btnStyle={btnStyle} type={ButtonOptions.Type.MUTED_OUTLINE}>
                        <BagIcon stroke={mainTopBtnColor} width={24} height={24}/>
                        {
                            (cartItems.length > 0) &&
                            <View style={style.countBubble}>
                                <DzText style={style.countBubbleText}>
                                    {cartItems.length}
                                </DzText>
                            </View>
                        }
                    </IconButton>
                </View>
            </View>
        </View>
    );
};

export default ProductDetailsContainer;
