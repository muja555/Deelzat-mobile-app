import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import Modal from "react-native-modal";

import { productOptionsModalStyle as style } from './product-options.modal.style';
import CloseIcon from "assets/icons/Close.svg";
import {Colors, LayoutStyle, LocalizedLayout} from "deelzat/style";
import {DzText, SelectValueGrid, Touchable} from "deelzat/v2-ui";
import {Space} from "deelzat/ui";
import I19n, {isRTL} from "dz-I19n";
import ImageWithBlur from "deelzat/v2-ui/image-with-blur";
import {refactorImageUrl} from "modules/main/others/main-utils";
import {prepareProduct} from "modules/product/others/product-details.utils";
import ProductQuantityControl from "v2modules/product/components/product-quantity-control/product-quantity-control.component";
import ColorsPalette from "v2modules/shared/components/colors-palette/colors-palette.component";
import {getVariantLabel} from "modules/cart/others/cart.utils";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";
import {useSelector} from "react-redux";

let ProductModalOptions = {};
function ProductOptionsModal() {

    this.show = () => {};

    this.Modal = () => {

        const currencyCode = useSelector(geoSelectors.currencyCodeSelector);
        const [isVisible, isVisibleSet] = useState(false);
        const [isMounted, isMountedSet] = useState(false);

        const [fullProduct, fullProductSet] = useState();
        const [colorOptions, colorOptionsSet] = useState([]);
        const [sizeOptions, sizeOptionsSet] = useState([]);

        const [selectedVariant, selectedVariantSet] = useState();
        const [selectedColor, selectedColorSet] = useState();
        const [selectedSize, selectedSizeSet] = useState();
        const [selectedCount, selectedCountSet] = useState(1);

        this.show = (show = true, showOptions = {}) => {
            ProductModalOptions = showOptions;
            isVisibleSet(show);
            if (!show) {
                onHide();
            } else {
                isMountedSet(true);
            }
        };

        const onHide = () => {
            fullProductSet();
            selectedVariantSet();
            selectedColorSet();
            selectedSizeSet();
            selectedCountSet(1);
            colorOptionsSet([]);
            sizeOptionsSet([]);
            ProductModalOptions = {skeleton: {}};
            isVisibleSet(false);
            setTimeout(() => {
                isMountedSet(false);
            }, 250);

        };

        useEffect(() => {
            if (!isVisible) {
                return;
            }

            const product = prepareProduct(ProductModalOptions.skeleton, ProductModalOptions.skeleton);
            if (product && !product.isNotFound) {
                sizeOptionsSet(product.UIOptionsSize || []);
                colorOptionsSet(product.UIOptionsColor || []);
                fullProductSet(product);
            }
            else {
                colorOptionsSet([]);
                sizeOptionsSet([]);
                selectedVariantSet();
                selectedColorSet();
                selectedSizeSet();
                selectedCountSet(1);
                fullProductSet(product);
            }

        }, [isVisible]);


        // On select size, enable only options that includes this value
        useEffect(() => {
            if (!fullProduct) {
                return;
            }

            if (selectedColor?.disabled) {
                selectedColorSet()
            }
            if (colorOptions.length) {
                const sizeVariants = fullProduct.variants?.filter(variant => !selectedSize || variant.option2 === selectedSize.value);
                const _colorOptions = colorOptions.map(color => {
                    let colorExistsInVariants = false;
                    sizeVariants?.forEach(variant => {
                        if (variant.option1 === color.title) {
                            colorExistsInVariants = true;
                        }
                    })
                    color.disabled = !colorExistsInVariants || !fullProduct || fullProduct.isNotFound;
                    return color;
                });
                colorOptionsSet(_colorOptions)
            }
        }, [selectedSize, fullProduct]);


        // On select color, enable only options that includes this value
        useEffect(() => {
            if (selectedSize?.disabled) {
                selectedSizeSet()
            }
            if (sizeOptions.length) {
                const colorVariants = fullProduct.variants?.filter(variant => !selectedColor || variant.option1 === selectedColor.title);
                const _sizeOptions = sizeOptions.map(size => {
                    let sizeExistsInVariants = false;
                    colorVariants?.forEach(variant => {
                        if (variant.option2 === size.value) {
                            sizeExistsInVariants = true;
                        }
                    })
                    size.disabled = !sizeExistsInVariants || !fullProduct || fullProduct.isNotFound;
                    return size;
                });
                sizeOptionsSet(_sizeOptions, fullProduct);
            }
        }, [selectedColor]);



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

        // Update selected variant based on selected options
        useEffect(() => {
            let _selectedVariant = undefined;
            fullProduct?.variants?.forEach(variant => {

                if (variant.option1 === selectedColor?.title) {
                    if (variant.option2 === selectedSize?.value) {
                        _selectedVariant = variant
                    }
                    // in case of 'no-size' text was in variants
                    else if (!fullProduct?.UIOptionsSize?.length && (variant.option2 === 'no-size' || !variant.option2)) {
                        _selectedVariant = variant
                    }
                }
            })
            selectedVariantSet(_selectedVariant);
            if (!!_selectedVariant && selectedCount > _selectedVariant.inventory_quantity) {
                selectedCountSet(_selectedVariant?.inventory_quantity)
            }
        }, [selectedColor, selectedSize]);


        if (!isMounted) {
            return <></>
        }


        const price = parseFloat((selectedVariant ?? fullProduct ?? ProductModalOptions.skeleton)['price']);
        const compareAtPrice = parseFloat((selectedVariant ?? fullProduct ?? ProductModalOptions.skeleton)['compare_at_price']);
        const inventoryQuantity = parseFloat((selectedVariant ?? fullProduct ?? ProductModalOptions.skeleton)['inventory_quantity']);
        const canChangeProductQuantity = !fullProduct?.isNotFound && inventoryQuantity > 0;


        const onSizeOptionPress = (values) => {
            selectedSizeSet(values.length? values[0] : undefined)
        };


        const onColorOptionPress = (values) => {
            selectedColorSet(values.length? values[0] : undefined);
        };


        const variantLabel = getVariantLabel(selectedVariant);
        let actionBtnDisabled;
        if (!canChangeProductQuantity) {
            actionBtnDisabled = true;
        }
        else if (!fullProduct || fullProduct?.isNotFound) {
            actionBtnDisabled = true;
        }
        else if (selectedVariant) {
            actionBtnDisabled = !(selectedVariant.inventory_quantity > 0);
        }
        else {
            const hasColors = colorOptions.length > 0;
            const hasSizes = sizeOptions.length > 0;
            const isValidColorSelection = (hasColors && !!selectedColor) || !hasColors;
            const isValidSizeSelection = (hasSizes && !!selectedSize) || !hasSizes;
            actionBtnDisabled = (!isValidSizeSelection || !isValidColorSelection);
        }


        return (
            <Modal
                onBackButtonPress={onHide}
                onBackdropPress={onHide}
                useNativeDriver={true}
                isVisible={isVisible}
                style={style.container}>
                <View style={style.content}>
                    <Touchable hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                               style={style.closeView}
                               onPress={onHide}>
                        <CloseIcon
                            stroke={Colors.N_BLACK}
                            width={16}
                            height={16}/>
                    </Touchable>
                    <Space directions={'h'} size={['lg', 'sm']} />
                    <DzText style={style.detailsTxt}>
                        {I19n.t('تفاصيل المنتج')}
                    </DzText>
                    <Space directions={'h'} size={'md'} />
                    <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                        <ImageWithBlur
                            style={style.image}
                            resizeMode="cover"
                            resizeMethod="resize"
                            thumbnailUrl={refactorImageUrl(fullProduct?.image,  1)}
                            imageUrl={refactorImageUrl(fullProduct?.image, style.image.width)}/>
                        <Space directions={'v'} size={['md', '']} />
                        <View style={[LayoutStyle.Flex, {justifyContent: 'space-around'}]}>
                            <DzText style={style.productTitle}>
                                {ProductModalOptions.skeleton.title}
                            </DzText>
                            <Space directions={'h'} size={'sm'}/>
                            <DzText style={[style.variantLabel]}>
                                {variantLabel}
                            </DzText>
                            <Space directions={'h'} size={'sm'}/>
                            {
                                (!canChangeProductQuantity) &&
                                <DzText style={[style.soldOutText, LocalizedLayout.TextAlign(isRTL())]}>
                                    {I19n.t('نفذت الكمية')}
                                </DzText>
                            }
                            {
                                (!fullProduct?.isNotFound) &&
                                <View>
                                    {
                                        (compareAtPrice > 0) &&
                                        <DzText style={[style.compareAtPrice, LocalizedLayout.TextAlign(isRTL())]}>
                                            {`${compareAtPrice} ${currencyCode}`}
                                        </DzText>
                                    }
                                    <DzText style={[style.price,
                                        (compareAtPrice > 0) && style.priceDiscount,
                                        LocalizedLayout.TextAlign(isRTL())]}>
                                        {`${price} ${currencyCode}`}
                                    </DzText>
                                </View>
                            }
                        </View>
                    </View>
                    <Space directions={'h'} size={'lg'} />
                    {
                        (sizeOptions.length > 0) &&
                        <>
                            <SelectValueGrid multi={false}
                                             keyBy={'value'}
                                             labelBy={'title'}
                                             options={sizeOptions}
                                             selectedStyle={style.selectedSize}
                                             value={selectedSize? [selectedSize] : []}
                                             onChange={onSizeOptionPress}/>
                            <Space directions={'h'} size={'md'} />
                        </>
                    }
                    <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                        <View style={style.colorOptions}>
                            {
                                (colorOptions.length > 0) &&
                                <ColorsPalette multi={false}
                                               colors={colorOptions}
                                               selected={selectedColor ? [selectedColor] : []}
                                               onChange={onColorOptionPress}/>
                            }
                        </View>
                        {
                            (!!fullProduct && canChangeProductQuantity) &&
                            <ProductQuantityControl value={selectedCount} onChange={selectedCountSet} max={inventoryQuantity}/>
                        }
                    </View>
                    <Space directions={'h'} size={'lg'} />
                    <Touchable onPress={() => ProductModalOptions.onActionPress(fullProduct, selectedVariant, selectedCount)}
                               disabled={actionBtnDisabled}
                               style={[style.actionBtn, actionBtnDisabled && {opacity: 0.6}]}>
                        <DzText style={style.actionText}>
                            {!!ProductModalOptions.actionBtnText? ProductModalOptions.actionBtnText : I19n.t('تأكيد')}
                        </DzText>
                    </Touchable>
                </View>
            </Modal>
        );
    };
};


const useProductOptionsModal = () => {
    return new ProductOptionsModal();
};
export default useProductOptionsModal;
