import React, {useState, useEffect} from 'react';
import {View, Text, Keyboard} from 'react-native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {Radio} from "deelzat/form";
import {Button, ButtonOptions, MultiValueGrid} from "deelzat/ui";

import {productEditPricesStyle as style} from './product-edit-prices.component.style';
import {useDispatch, useSelector} from "react-redux";
import {productActions, productSelectors, productThunks} from "modules/product/stores/product/product.store";
import {
    getProductPriceOptions,
    getVariantPriceQuantity
} from "modules/product/components/product-add/product-add.utils";
import {Space} from "deelzat/ui";
import ProductPriceQuantityControl
    from "modules/product/components/product-price-quantity-control/product-price-quantity-control.component";
import ProductVariantModeConst from "modules/product/constants/product-variant-mode.const";
import ProductPriceConst from "modules/product/constants/product-price.const";
import Toast from "deelzat/toast";
import ProductSubmitModal from "modules/product/modals/product-submit/product-submit.modal";
import {shopSelectors} from "modules/shop/stores/shop/shop.store";
import ShopEditModal from "modules/shop/modals/shop-edit/shop-edit.modal";
import {trackAddProductFieldFilled} from "modules/analytics/others/analytics.utils";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import I19n from 'dz-I19n';
import {DzText} from "deelzat/v2-ui";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import MainTabsNavsConst from 'v2modules/main/constants/main-tabs-navs.const';


const ProductEditPrices = () => {

    const dispatch = useDispatch();

    const shopState = useSelector(shopSelectors.shopStateSelector);
    const productState = useSelector(productSelectors.productStateSelector);
    const [variantMode, variantModeSet] = useState(null);
    const [forceUpdate, forceUpdateSet] = useState(1);
    const [errors, errorsSet] = useState({colors: {}});
    const [disableSubmit, disableSubmitSet] = useState(false);
    const [isProductSubmitModalVisible, isProductSubmitModalVisibleSet] = useState(false);
    const [isShopEditModalVisible, isShopEditModalVisibleSet] = useState(false);

    const ProductPriceOptions = getProductPriceOptions(!!productState.id);

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

    const validate = (submitAfterSuccess = false,
                      highlightErrors = false,
                      profileIsCompleted = false,
                      newShopData) => {

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


        if ((!!shopState.isProfileCompleted || profileIsCompleted)
            && (shopState?.shop?.name?.trim() || newShopData?.name?.trim())) {
            Keyboard.dismiss();
            disableSubmitSet(true);
            dispatch(productThunks.uploadImages());
            setTimeout(() => {
                isProductSubmitModalVisibleSet(true);
                disableSubmitSet(false);
            }, 500);
        } else {
            isShopEditModalVisibleSet(true);
        }

    };

    const onShopEditModalHide = (action, newShopData) => {
        isShopEditModalVisibleSet(false);
        if (action === 'DONE') {
            validate(true, true, true, newShopData);
            dispatch(productActions.SetData({
                newShopCreated: true
            }));
        }
    };

    useEffect(() => {
        if (variantMode) {
            onVariantChange(getVariantPriceQuantity(productState.variants, 'title'), true);
        }

    }, [variantMode]);

    useEffect(() => {

        const referenceCategory = productState.referenceCategory;

        if (referenceCategory) {
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

        }
    }, [productState.referenceCategory]);

    if (!productState) {
        return <></>;
    }

    const OutOfStockOption = getProductPriceOptions(true)[getProductPriceOptions(true).length - 1];

    return (
        <View style={style.container}>
            <KeyboardAwareScrollView keyboardDismissMode={'on-drag'}>
                <ShopEditModal
                    isVisible={isShopEditModalVisible}
                    pageTitle={I19n.t('متجرك تقريباً جاهز!') + '\n' + I19n.t('قم بتعبئة معلومات متجرك للاتصال وتوصيل منتجاتك')}
                    onHide={onShopEditModalHide}
                    trackSource={{name: EVENT_SOURCE.POST_PRODUCT}}
                />

                <ProductSubmitModal
                    isVisible={isProductSubmitModalVisible}
                    onHide={() => isProductSubmitModalVisibleSet(false)}
                    onPressGoToShop={() => {
                        isProductSubmitModalVisibleSet(false);
                        RootNavigation.goBack();
                        RootNavigation.navigate(MainTabsNavsConst.PROFILE);
                    }} />

                <Space size={'lg'} directions={'h'}/>
                <Radio
                    errorMessage={''}
                    keyBy={'value'}
                    descriptionBy={''}
                    iconBy={'icon'}
                    label={''}
                    options={ProductPriceOptions}
                    value={productState.isOutOfStockMode? OutOfStockOption: productState.priceMode}
                    onChange={onPriceModeSelect}
                />
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
            </KeyboardAwareScrollView>
            <Space size={'md'} directions={'md'}/>
            <Button
                onPress={() => validate(true, true)}
                disabled={!productState.priceMode || disableSubmit}
                type={ButtonOptions.Type.PRIMARY}
                text={I19n.t('حفظ')}
            />
            <Space directions={'h'} size={'lg'}/>
        </View>

    );
};

export default ProductEditPrices;
