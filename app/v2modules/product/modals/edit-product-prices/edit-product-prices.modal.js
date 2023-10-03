import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, Keyboard, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import Modal from "react-native-modal";

import { editProductPricesModalStyle as style } from './edit-product-prices.modal.style';
import {isEmptyValues, refactorImageUrl, shareApiError} from "modules/main/others/main-utils";
import {DzText, Touchable} from "deelzat/v2-ui";
import CloseIcon from "assets/icons/Close.svg";
import {Colors, LayoutStyle, Spacing} from "deelzat/style";
import {Button, MultiValueGrid, Space} from "deelzat/ui";
import I19n from "dz-I19n";
import ImageWithBlur from "deelzat/v2-ui/image-with-blur";
import {useDispatch, useSelector} from "react-redux";
import {mapDataForUpdate} from "modules/product/containers/product-update/product-update.container.utils";
import ProductVariantModeConst from "modules/product/constants/product-variant-mode.const";
import {
    getProductPriceOptions,
    getVariantPriceQuantity
} from "modules/product/components/product-add/product-add.utils";
import {
    productActions,
    productSelectors,
} from "modules/product/stores/product/product.store";
import Toast from "deelzat/toast";
import ProductPriceConst from "modules/product/constants/product-price.const";
import ProductPriceQuantityControl
    from "modules/product/components/product-price-quantity-control/product-price-quantity-control.component";
import store from "modules/root/components/store-provider/store-provider";
import ProductStoreInput from "modules/product/inputs/product-store.input";
import ProductApi from "modules/product/apis/product.api";
import * as Sentry from "@sentry/react-native";
import {trackAddProductFieldFilled, trackPostProductComplete} from "modules/analytics/others/analytics.utils";
import {Radio} from "deelzat/form";
import MyProfileService from "v2modules/shop/containers/my-profile/my-profile.container.service";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";
import WillShowToast from "deelzat/toast/will-show-toast";
import * as Actions from 'modules/shop/stores/shop/shop.actions';
import { shopSelectors } from 'modules/shop/stores/shop/shop.store';

let EditProductPricesOptions = {skeleton: {}};
function EditProductPricesModal() {

    this.show = () => {};

    this.Modal = (props) => {

        const {
            onVisibleChange = (isVisible) => {},
        } = props;

        const dispatch = useDispatch();
        const productState = useSelector(productSelectors.productStateSelector);
        const ProductPriceOptions = getProductPriceOptions(!!productState.id);
        const currencyCode = useSelector(geoSelectors.currencyCodeSelector);
        const newlyAddedProduct = useSelector(shopSelectors.addedTempProductSelector);

        const [keyboardIsVisible, keyboardIsVisibleSet] = useState(false);
        const [isRequesting, isRequestingSet] = useState(false);
        const [isMapping, isMappingSet] = useState(true);

        const [isVisible, isVisibleSet] = useState(false);
        const [isMounted, isMountedSet] = useState(false);

        const [forceUpdate, forceUpdateSet] = useState(1);
        const [variantMode, variantModeSet] = useState(null);
        const [errors, errorsSet] = useState({colors: {}});

        const [fullProduct, fullProductSet] = useState();

        this.show = (show = true, showOptions = {}) => {
            EditProductPricesOptions = showOptions;
            isVisibleSet(show);
            if (!show) {
                onHide();
            } else {
                isMountedSet(true);
            }
        };

        const onHide = () => {
            fullProductSet();
            EditProductPricesOptions = {skeleton: {}};
            isVisibleSet(false);
            dispatch(productActions.ResetData());
            variantModeSet();
            setTimeout(() => {
                isMountedSet(false);
            }, 250);
        };


        useEffect(() => {
            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => keyboardIsVisibleSet(true));
            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>   keyboardIsVisibleSet(false));

            return () => {
                keyboardDidHideListener.remove();
                keyboardDidShowListener.remove();
            };
        }, []);


        useEffect(() => {

            onVisibleChange(isVisible);
            if (!isVisible) {
                return;
            }

            const product = EditProductPricesOptions.skeleton;
            if (product && !product.isNotFound) {
                fullProductSet(product);
            }
            else {
                fullProductSet(product);
            }

            const state = store.getState();
            const data = mapDataForUpdate({
                product,
                categories: state.persistentData.categories,
                subCategories: state.persistentData.subCategories,
                fields: state.persistentData.fields,
            });
            dispatch(productActions.SetProductData({...data,}));
            isMappingSet(false);

        }, [isVisible]);


        const submit = () => {

            const state = store.getState();

            (async () => {

                try {
                    const productState = state.product;
                    const inputs = new ProductStoreInput();
                    inputs.uploadedImages = productState.images.map(image => ({...image, remoteUrl: image?.data?.uri}));
                    inputs.productState = productState;
                    inputs.allFields = state.persistentData.fields;
                    inputs.shopId = EditProductPricesOptions.shopId;
                    inputs.shopName = EditProductPricesOptions.shopId;
                    inputs.productId = productState.id;
                    inputs.overrideEmptyDescription = true;
                    const result = await ProductApi.update(inputs);

                    if (newlyAddedProduct?.id === productState.id) {
                        dispatch(Actions.SetAddedProduct(result?.data));
                    }
                    MyProfileService.refreshMyProfileStatus({withTimeout: true});

                    try {
                        trackPostProductComplete(productState, {shopId: EditProductPricesOptions.shopId});
                    } catch (w) {
                        console.log("[track-error] edit prices:", JSON.stringify(e));
                        console.log(w);
                        Sentry.captureMessage("[Analytics-ERROR] add product fail")
                        Sentry.captureException(w);
                    }

                    onHide();

                } catch (e) {

                    shareApiError(e, "edit prices product");
                    trackPostProductComplete(productState, {shopId: EditProductPricesOptions.shopId}, e?.data?.full_messages?.length > 0? JSON.stringify(e?.data?.full_messages) : "");

                    console.warn("edit product prices error:", JSON.stringify(e));
                    try {Sentry.captureException(e)} catch (x){}
                    try {
                        let errorString;
                        if (e?.data?.full_messages?.length > 0) {
                            errorString = e?.data?.full_messages;
                        }
                        else if (e?.data) {
                            errorString = JSON.stringify(e?.data);
                        }
                        else {
                            errorString = JSON.stringify(e);
                        }
                        Sentry.captureMessage("[api-error] edit prices: " + errorString);
                    } catch (y){

                    }

                    Toast.danger(I19n.t('حصل خطأ ما') + "\n" + I19n.t('يرجى التحقق من إتصالك بشبكة الانترنت والمحاولة مرة'));
                }

                isRequestingSet(false);
            })();
        }

        useEffect(() => {

            if (!isMounted || !productState.referenceCategory) {
                return;
            }

            const referenceCategory = productState.referenceCategory;
            const hasColor = !!referenceCategory.has_variance;
            const hasSizes = !!referenceCategory.size_fields && referenceCategory.size_fields.length > 0;

            if (!hasColor && !hasSizes) {
                variantModeSet(ProductVariantModeConst.NO_COLOR_NO_SIZE);
            } else if (!hasColor && hasSizes) {
                variantModeSet(ProductVariantModeConst.NO_COLOR_MULTI_SIZE);
            } else if (hasColor && !hasSizes) {
                variantModeSet(ProductVariantModeConst.MULTI_COLOR_NO_SIZE);
            } else {
                variantModeSet(ProductVariantModeConst.MULTI_COLOR_MULTI_SIZE);
            }

        }, [isMounted, productState.referenceCategory]);

        useEffect(() => {
            if (isMounted && variantMode) {
                onVariantChange(getVariantPriceQuantity(productState.variants, 'title'), true);
            }
        }, [variantMode, isMounted]);

        if (!isMounted || isEmptyValues(productState)) {
            return <></>;
        }

        const onColorSizesChange = (color, sizes) => {
            dispatch(productActions.SetSizesOf({
                color: color,
                sizes: sizes
            }));

            onVariantChange(getVariantPriceQuantity(productState.variants, 'title'), true);
        };

        const onVariantChange = (value, fillNewVariantsOnly = false) => {

            if (value.option1 === 'title') {
                validate();
                productState.variants.forEach((item) => {
                    if (item.option1 !== 'title') {
                        if (!fillNewVariantsOnly || (fillNewVariantsOnly && item._status && item._status === 'NEW')) {
                            item.price = value.price;
                            item.price_sale = value.price_sale;
                            item.quantity = value.quantity;
                            item._status = 'UPDATED';
                        }

                    }
                })
            }

            dispatch(productActions.SetVariant(value));
        };

        const getSizesControls = (key) => {

            const id = productState.size.name + '@' + key;

            return (productState.sizes[id] || [])
                .sort((a, b) => a.sort - b.sort)
                .map((item, index) => {

                    return (
                        <View key={key + '_' + item.value}>
                            <View style={style.controlRow}>
                                <View style={style.controlRowHeadView}>
                                    <DzText>{item.title}</DzText>
                                </View>
                                <View style={style.productPriceQuantityControlView}>
                                    <ProductPriceQuantityControl
                                        showHead={index === 0}
                                        priceModeValue={productState.priceMode?.value}
                                        isOutOfStockMode={productState.isOutOfStockMode}
                                        value={getVariantPriceQuantity(productState.variants, key, item.value)}
                                        onChange={onVariantChange}
                                        trackKey={item.value + "@" + key}
                                    />
                                </View>
                            </View>
                            <Space directions={'h'}/>
                        </View>

                    );
                });
        };

        const colorsSizesPricesContent = !productState.size ? <></> : (productState.colors || []).map((color) => {
            const id = productState.size.name + '@' + color.title;
            return (
                <View key={color.color}>
                    <View style={style.colorView}>
                        <View style={[style.colorCircle, {backgroundColor: color.color}]}/>
                        <DzText style={style.colorTitle}>{color.nickName}</DzText>
                        <DzText style={style.colorErrorMessage}> {errors.colors[id]} </DzText>
                    </View>
                    <Space size={'md'} directions={'h'}/>
                    <MultiValueGrid
                        keyBy={'value'}
                        labelBy={'title'}
                        options={productState.size.options}
                        value={productState.sizes[id]}
                        onChange={(sizes) => onColorSizesChange(id, sizes)}
                    />
                    <Space size={'md'} directions={'h'}/>
                    {getSizesControls(color.title)}
                    <Space size={'lg'} directions={'h'}/>
                </View>
            );
        });

        const colorsPricesContent = (productState.colors || []).map((color, index) => {
            return (
                <View key={color.color}>
                    <View style={style.colorView}>
                        <View style={[style.colorCircle, {backgroundColor: color.color}]}/>
                        <DzText>{color.nickName}</DzText>
                    </View>
                    <Space size={'md'} directions={'h'}/>
                    <ProductPriceQuantityControl
                        showHead={index === 0}
                        priceModeValue={productState.priceMode?.value}
                        isOutOfStockMode={productState.isOutOfStockMode}
                        value={getVariantPriceQuantity(productState.variants, color.title)}
                        onChange={onVariantChange}
                        trackKey={color.title}
                    />
                    <Space size={'lg'} directions={'h'}/>
                </View>
            );
        });

        const validateVariant = (variant) => {

            variant.errors = {};

            if (parseInt(variant.quantity) === 0 && !productState.id) {
                variant.errors.quantity = true;
            }

            if (parseInt(variant.price) === 0 && productState.priceMode.value !== ProductPriceConst.FREE) {
                variant.errors.price = true;
            }

            if (productState.priceMode.value === ProductPriceConst.SALE) {
                if (parseInt(variant.price_sale) === 0) {
                    variant.errors.price_sale = true;
                }

                if (parseInt(variant.price_sale) > parseInt(variant.price)) {
                    variant.errors.price_sale = true;
                }

            }

        };

        const validate = (submitAfterSuccess = false, highlightErrors = true) => {

            const _errors = {
                colors: {},
                variants: []
            };

            const variantsOfCurrentSelection = [];

            dispatch(productActions.SetData({
                variantsOfCurrentSelection: variantsOfCurrentSelection
            }));

            const sizes = productState.sizes;
            const variants = productState.variants;

            if (variantMode === ProductVariantModeConst.MULTI_COLOR_MULTI_SIZE) {
                productState.colors.forEach((color) => {
                    const id = productState.size.name + '@' + color.title;

                    if (!sizes[id] || sizes[id].length === 0) {
                        _errors.colors[id] = I19n.t('الرجاء اختيار حجم واحد على الأقل');
                    } else {
                        sizes[id].forEach((size) => {

                            let variant = variants.find((v) => {
                                return v.option1 === color.title && v.option2 === size.value;
                            });

                            if (!variant) {
                                variant = getVariantPriceQuantity(variants, color.title, size.value);
                                variants.push(variant);
                            }

                            validateVariant(variant);
                            variantsOfCurrentSelection.push(variant);
                            if (!highlightErrors) {
                                variant.errors = {};
                            }

                        })
                    }
                });
            } else if (variantMode === ProductVariantModeConst.MULTI_COLOR_NO_SIZE) {
                productState.colors.forEach((color) => {

                    let variant = variants.find((v) => {
                        return v.option1 === color.title && !v.option2;
                    });

                    if (!variant) {
                        variant = getVariantPriceQuantity(variants, color.title);
                        variants.push(variant);
                    }

                    validateVariant(variant);
                    variantsOfCurrentSelection.push(variant);
                    if (!highlightErrors) {
                        variant.errors = {};
                    }
                });
            } else if (variantMode === ProductVariantModeConst.NO_COLOR_MULTI_SIZE) {
                const id = productState.size.name + '@' + 'NO_COLOR';
                if (!sizes[id] || sizes[id].length === 0) {
                    _errors.colors[id] = I19n.t('الرجاء اختيار حجم واحد على الأقل');
                } else {
                    sizes[id].forEach((size) => {

                        let variant = variants.find((v) => {
                            return v.option1 === 'NO_COLOR' && v.option2 === size.value;
                        });

                        if (!variant) {
                            variant = getVariantPriceQuantity(variants, 'NO_COLOR', size.value);
                            variants.push(variant);
                        }

                        validateVariant(variant);
                        variantsOfCurrentSelection.push(variant);
                        if (!highlightErrors) {
                            variant.errors = {};
                        }

                    })
                }
            }

            let variant = variants.find((v) => {
                return v.option1 === 'title' && !v.option2;
            });

            if (!variant) {
                variant = getVariantPriceQuantity(variants, 'title');
                variants.push(variant);
            }

            validateVariant(variant);
            if (variantMode === ProductVariantModeConst.NO_COLOR_NO_SIZE) {
                variantsOfCurrentSelection.push(variant);
            }

            if (!highlightErrors) {
                variant.errors = {};
            }

            forceUpdateSet(forceUpdate + 1);


            if (!submitAfterSuccess) {
                return;
            }


            errorsSet(_errors);

            if (Object.keys(_errors.colors).length > 0) {
                Toast.danger(I19n.t('الرجاء إختيار الأحجام المطلوبة'));
                return;
            }

            let hasError = 0;
            let hasPriceSaleError = false;
            variantsOfCurrentSelection.forEach((item) => {
                if (item.errors && Object.keys(item.errors).length > 0) {
                    hasPriceSaleError = hasPriceSaleError || !!item.errors.price_sale;
                    hasError++;
                }
            });

            if (hasError) {
                let message = I19n.t('بعض الحقول تحتاج الى تعبئة');
                if (productState.priceMode.value !== ProductPriceConst.FREE && hasPriceSaleError) {
                    message = message + ', ' + I19n.t('السعر بعد الخصم يجب أن يكون أقل من السعر الأصلي وأكبر من 0');
                }
                Toast.danger(message);
                return;
            }

            dispatch(productActions.SetData({
                variantsOfCurrentSelection: variantsOfCurrentSelection,
                variantMode: variantMode
            }));

            isRequestingSet(true);
            setTimeout(() => {
                Keyboard.dismiss();
                submit();
            }, 250);

        };

        const onPriceModeSelect = (priceMode) => {
            if (priceMode.value === ProductPriceConst.SOLD_OUT) {
                dispatch(productActions.SetData({
                    isOutOfStockMode: true,
                }));
            } else {
                dispatch(productActions.SetData({
                    priceMode: priceMode,
                    isOutOfStockMode: false,
                }));
            }

            trackAddProductFieldFilled('price_mode', priceMode.value);
        };

        let originPrice = 0;
        const productToGetFrom = fullProduct ?? EditProductPricesOptions.skeleton;
        if (productToGetFrom) {
            const compareAtPrice = productToGetFrom.compare_at_price;
            const price = productToGetFrom.price;
            originPrice = compareAtPrice > 0? compareAtPrice: price;
        }


        const OutOfStockOption = getProductPriceOptions(true)[getProductPriceOptions(true).length - 1];

        return (
            <Modal
                onBackButtonPress={onHide}
                onBackdropPress={onHide}
                useNativeDriver={true}
                isVisible={isVisible}
                style={style.container}>
                <WillShowToast id={'edit-prices'}/>
                <KeyboardAvoidingView style={style.content} behavior={Platform.OS === 'ios' ? 'padding' : 'none'}>
                    <ScrollView contentContainerStyle={Spacing.HorizontalPadding}>
                        {
                            (isMapping) &&
                            <ActivityIndicator size="large" color={Colors.MAIN_COLOR} style={style.mappingLoader}/>
                        }
                        {
                            (!isMapping) &&
                            <>
                                <View style={style.headerView}>
                                    <ImageWithBlur
                                        style={style.image}
                                        resizeMode="cover"
                                        resizeMethod="resize"
                                        thumbnailUrl={refactorImageUrl(fullProduct?.image, 1)}
                                        imageUrl={refactorImageUrl(fullProduct?.image, style.image.width)}/>
                                    <Space directions={'v'} size={['md', 'xs']}/>
                                    <View style={LayoutStyle.Flex}>
                                        <Space directions={'h'} size={'lg'}/>
                                        <DzText style={style.productTitle}>
                                            {EditProductPricesOptions.skeleton.title}
                                        </DzText>
                                        <View style={style.priceOriginContainer}>
                                            <DzText style={style.originalPriceTitle}>
                                                {I19n.t('السعر الأصلي') + ":"}
                                            </DzText>
                                            <View style={{width: 30}}/>
                                            <DzText style={style.originalPrice}>
                                                {`${originPrice} ${currencyCode}`}
                                            </DzText>
                                        </View>
                                    </View>
                                    <Touchable hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                                               style={style.closeView}
                                               onPress={onHide}>
                                        <CloseIcon
                                            stroke={Colors.N_BLACK}
                                            width={16}
                                            height={16}/>
                                    </Touchable>
                                </View>
                                <Space directions={'h'} size={'md'}/>
                                <Radio
                                    errorMessage={''}
                                    keyBy={'value'}
                                    descriptionBy={''}
                                    iconBy={'icon'}
                                    label={''}
                                    options={ProductPriceOptions}
                                    value={productState.isOutOfStockMode? OutOfStockOption: productState.priceMode}
                                    radioOptionIconStyle={style.priceModes}
                                    labelStyle={style.priceModesLabel}
                                    descriptionStyle={{fontSize: 9}}
                                    onChange={onPriceModeSelect}
                                />
                                <Space directions={'h'}/>
                                {
                                    ((!productState.id || variantMode === ProductVariantModeConst.NO_COLOR_NO_SIZE) && forceUpdate) &&
                                    <>
                                        <Space size={'lg'} directions={'h'}/>
                                        <ProductPriceQuantityControl
                                            priceModeValue={productState.priceMode?.value}
                                            isOutOfStockMode={productState.isOutOfStockMode}
                                            value={getVariantPriceQuantity(productState.variants, 'title')}
                                            onChange={onVariantChange}
                                        />
                                        <Space size={'lg'} directions={'h'}/>
                                    </>
                                }
                                {
                                    (!!productState.size && variantMode === ProductVariantModeConst.NO_COLOR_MULTI_SIZE && forceUpdate) &&
                                    <>
                                        <Space size={'lg'} directions={'h'}/>
                                        <DzText
                                            style={style.colorErrorMessage}> {errors.colors[productState.size.name + '@' + 'NO_COLOR']} </DzText>
                                        <Space directions={'h'}/>
                                        <MultiValueGrid
                                            keyBy={'value'}
                                            labelBy={'title'}
                                            options={productState.size.options}
                                            value={productState.sizes[productState.size.name + '@' + 'NO_COLOR']}
                                            onChange={(sizes) => onColorSizesChange(productState.size.name + '@' + 'NO_COLOR', sizes)}
                                        />
                                        <Space size={'md'} directions={'h'}/>
                                        {getSizesControls('NO_COLOR')}
                                        <Space size={'md'} directions={'h'}/>
                                    </>
                                }
                                {
                                    (variantMode === ProductVariantModeConst.MULTI_COLOR_MULTI_SIZE && forceUpdate) &&
                                    <>
                                        <Space size={'lg'} directions={'h'}/>
                                        {colorsSizesPricesContent}
                                    </>
                                }
                                {
                                    (variantMode === ProductVariantModeConst.MULTI_COLOR_NO_SIZE && forceUpdate) &&
                                    <>
                                        <Space size={'lg'} directions={'h'}/>
                                        {colorsPricesContent}
                                        <Space size={'lg'} directions={'h'}/>
                                    </>
                                }
                                {
                                    (keyboardIsVisible) &&
                                    <View style={[style.buttonView, {position: 'relative', paddingEnd: 0, paddingStart: 0, width: 'auto'}]}>
                                        <Button
                                            disabled={isRequesting}
                                            loading={isRequesting}
                                            onPress={() => validate(true, true)}
                                            text={I19n.t('تأكيد السعر')}/>
                                        <Space directions={'h'} size={'lg'}/>
                                    </View>
                                }
                                {
                                    (!keyboardIsVisible) &&
                                    <Space directions={'h'} size={['lg', 'lg']}/>
                                }
                            </>
                        }
                    </ScrollView>
                    {
                        (!keyboardIsVisible) &&
                        <View style={style.buttonView}>
                            <Button
                                disabled={isRequesting}
                                loading={isRequesting}
                                onPress={() => validate(true, true)}
                                text={I19n.t('تأكيد السعر')}/>
                            <Space directions={'h'} size={'lg'}/>
                        </View>
                    }
                </KeyboardAvoidingView>
            </Modal>
        );
    };
};


const useEditProductPricesModal = () => {
    return new EditProductPricesModal();
};
export default useEditProductPricesModal;
