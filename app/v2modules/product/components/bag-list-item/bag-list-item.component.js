import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { bagListItemStyle as style } from './bag-list-item.component.style';
import {getVariantLabel} from "modules/cart/others/cart.utils";
import {refactorImageUrl} from "modules/main/others/main-utils";
import ImageSize from "v2modules/main/others/image-size.const";
import {DzText, ImageWithBlur, Touchable} from "deelzat/v2-ui";
import {Space} from "deelzat/ui";
import CloseIcon from "assets/icons/Close.svg"
import MinusIcon from "assets/icons/Minus3.svg";
import PlusIcon from "assets/icons/Plus3.svg";
import {Colors, LayoutStyle, LocalizedLayout} from "deelzat/style";
import I19n, {isRTL} from 'dz-I19n';

const BagListItem = (props) => {

    const {
        cartItem = {},
        currencyCode = '',
        onMoveToSavePress = (item) => {},
        onChangeQuantity = (diff) => {},
        onProductPress = () => {},
        onLongPress = () => {},
        onPressOut = () => {},
    } = props;

    const { product, variant} = cartItem;

    const missingSomething = cartItem.isMissingVariant || cartItem.product?.isNotFound;
    let price = parseFloat((variant? variant.price: product.price) || 0) * cartItem.quantity;
    let inventoryQuantity = parseInt((variant? variant.inventory_quantity : product.inventory_quantity) || 0);

    const minusButtonDisabled = cartItem.quantity === 1 || missingSomething;
    const plusButtonDisabled = cartItem.quantity >= inventoryQuantity || missingSomething;

    const onPressPlusBtn = () => onChangeQuantity(1);
    const onPressMinusBtn = () => onChangeQuantity(-1);
    const onPressRemove = () => onChangeQuantity(0);

    const variantLabel = getVariantLabel(variant);

    return (
        <View style={style.container}>
            <Touchable onPress={onProductPress}
                       onLongPress={onLongPress}
                       onPressOut={onPressOut}
                       style={style.image}>
                <ImageWithBlur
                    style={style.image}
                    resizeMode="cover"
                    resizeMethod="resize"
                    thumbnailUrl={refactorImageUrl(product.image, 1)}
                    imageUrl={refactorImageUrl(product.image, style.image.width)}/>
            </Touchable>
            <Space directions={'v'} size={['xs', 'sm', '']}/>
            <View style={LayoutStyle.Flex}>
                {
                    (!missingSomething)?
                    <DzText style={[style.price, LocalizedLayout.TextAlign(isRTL())]}>
                        {price + ' ' + currencyCode}
                    </DzText>  :
                        <Space directions={'h'} size={'md'} />
                }
                <Space directions={'h'} size={'xm'} />
                <DzText style={[style.title, LocalizedLayout.TextAlign(isRTL())]} numberOfLines={2}>
                    {product.title}
                </DzText>
                {
                    (missingSomething) &&
                    <DzText style={style.missingLabel}>
                        {I19n.t(
                            cartItem.isMissingVariant ?
                                'الخيار المحدد للمنتج غير متوفر حالياً' :
                                'نفذت الكمية'
                        )}
                    </DzText>
                }
                {
                    (!missingSomething) &&
                    <DzText style={style.variantLabel}>
                        {variantLabel}
                    </DzText>
                }
                <View style={LayoutStyle.Flex}/>
                <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                    <Touchable onPress={() => onMoveToSavePress(cartItem)}
                               hitSlop={{top: 20, bottom: 20, left: 5, right: 5}}>
                        <View>
                            <DzText style={[style.moveToSaved, !isRTL() && {fontSize: 14}]}>
                                {I19n.t('إضافة للمفضلة')}
                            </DzText>
                        </View>
                    </Touchable>
                    <View style={LayoutStyle.Flex}/>
                    {
                        (!missingSomething) &&
                        <View style={style.quantityControl}>
                            <Touchable onPress={onPressMinusBtn}
                                       style={{opacity: minusButtonDisabled? 0.5 : 1}}
                                       disabled={minusButtonDisabled}
                                       hitSlop={{top: 50, bottom: 50, left: 5, right: 5}}>
                                <MinusIcon width={12}
                                           fill={Colors.N_GREY_5}
                                           height={2}/>
                            </Touchable>
                            <DzText style={[style.quantityText, plusButtonDisabled && {color: Colors.MAIN_COLOR}]}>
                                {cartItem.quantity}
                            </DzText>
                            <Touchable onPress={onPressPlusBtn}
                                       style={{opacity: plusButtonDisabled? 0.5 : 1}}
                                       disabled={plusButtonDisabled}
                                       hitSlop={{top: 10, bottom: 10, left: 5, right: 5}}>
                                <PlusIcon width={12}
                                          fill={Colors.N_GREY_5}
                                          height={12}/>
                            </Touchable>
                        </View>
                    }
                </View>
            </View>
            <Touchable hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                       onPress={onPressRemove}
                       style={style.closeBtn}>
                <CloseIcon
                    stroke={'#fff'}
                    width={16}
                    height={16}/>
            </Touchable>
        </View>
    );
};

export default BagListItem;
