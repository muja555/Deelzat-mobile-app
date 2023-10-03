import React, {useRef} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import { TextField } from "deelzat/form";

import { productPriceQuantityControlStyle as style } from './product-price-quantity-control.component.style';
import ProductPriceConst from "modules/product/constants/product-price.const";
import {filterStringToNumbers} from "modules/main/others/main-utils";
import {trackAddProductFieldFilled} from "modules/analytics/others/analytics.utils";
import I19n from 'dz-I19n';
import {LocalizedLayout} from "deelzat/style";
import {DzText} from "deelzat/v2-ui";
import {useSelector} from "react-redux";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";

const ProductPriceQuantityControl = (props) => {

    const {
        value = null,
        priceModeValue = null,
        onChange = (value) => {},
        showHead = true,
        trackKey = '',
        isOutOfStockMode = false,
    } = props;

    const onValueChange = (key, _value) => {

        let newValue = { ...value };
        if (_value.length > 1 && _value.startsWith('0')) {
            _value = _value.substring(1);
        }
        else if (_value === '') {
            _value = '0';
        }
        _value = _value.replace(/[^\d.]/g, '');

        if(_value.split('.').length > 2) {
            return;
        }

        newValue[key] = _value;
        onChange(newValue);
    };

    const priceLabel = !showHead ? '' : (priceModeValue === ProductPriceConst.SALE) ? I19n.t('السعر الأصلي') : I19n.t('السعر');

    const getValueOf = (key) => {
        return value[key] + '';
    };

    const fieldsRefs = useRef({});
    const currencyCode = useSelector(geoSelectors.currencyCodeSelector);

    const valueOfQuantity = getValueOf('quantity');
    const valueOfPrice = getValueOf('price');
    const valueOfPriceSale = getValueOf('price_sale');

    const isSale = priceModeValue === ProductPriceConst.SALE

    return (
        <View style={style.row}>
                <TouchableOpacity style={style.control}
                                  activeOpacity={1}
                                  onPress={() => {
                                      fieldsRefs.current.quantity.focus();
                                  }}>
                    <TextField
                        textInputRef={ref => fieldsRefs.current.quantity = ref}
                        pointerEvents="none"
                        label={showHead ? I19n.t('الكمية') : ''}
                        keyboardType={'numeric'}
                        editable={!isOutOfStockMode}
                        value={isOutOfStockMode? "0": valueOfQuantity}
                        inputStyle={[value?.errors?.quantity ? style.hasError : {}, style.textFieldDirection, isOutOfStockMode && Platform.OS === 'ios' && {opacity: 0.5}]}
                        selectTextOnFocus={true}
                        blurOnSubmit={false}
                        onChangeText={(text) => onValueChange('quantity', filterStringToNumbers(text))}
                        onBlur={() => trackAddProductFieldFilled(trackKey + ":quantity", valueOfQuantity)}
                        returnKeyType={(Platform.OS === 'ios') ? 'done' : 'next' }
                        onSubmitEditing={() => fieldsRefs.current?.price?.focus()}
                    />
                </TouchableOpacity>
            {
                (priceModeValue === ProductPriceConst.FULL_PRICE || priceModeValue === ProductPriceConst.SALE) &&
                <TouchableOpacity style={[style.control, {flex: 2}]}
                                  activeOpacity={1}
                                  onPress={() => {
                                      fieldsRefs.current?.price?.focus();
                                  }}>
                    <TextField
                        textInputRef={ref => fieldsRefs.current.price = ref}
                        pointerEvents="none"
                        prepend={<DzText style={style.textFieldPrepend}>{currencyCode}</DzText>}
                        label={priceLabel}
                        keyboardType={'numeric'}
                        blurOnSubmit={!isSale}
                        value={valueOfPrice}
                        editable={!isOutOfStockMode}
                        inputStyle={[value?.errors?.price ? style.hasError : {}, style.textFieldDirection, LocalizedLayout.TextAlign(), isOutOfStockMode && Platform.OS === 'ios' && {opacity: 0.5}]}
                        selectTextOnFocus={true}
                        onChangeText={(text) => onValueChange('price', filterStringToNumbers(text))}
                        onBlur={() => trackAddProductFieldFilled(trackKey + ":price", valueOfPrice)}
                        returnKeyType={(!isSale || Platform.OS === 'ios') ? 'done' : 'next' }
                        onSubmitEditing={() => isSale && fieldsRefs.current?.priceSale?.focus()}
                    />
                </TouchableOpacity>
            }

            {
                isSale &&
                <TouchableOpacity style={[style.control, {flex: 2}]}
                                  activeOpacity={1}
                                  onPress={() => {
                                      fieldsRefs.current.priceSale.focus();
                                  }}>
                    <TextField
                        textInputRef={ref => fieldsRefs.current.priceSale = ref}
                        pointerEvents="none"
                        prepend={<DzText style={style.textFieldPrepend}>{currencyCode}</DzText>}
                        label={ showHead ? I19n.t('السعر بعد الخصم') : '' }
                        keyboardType={'numeric'}
                        value={valueOfPriceSale}
                        editable={!isOutOfStockMode}
                        blurOnSubmit={true}
                        inputStyle={[value?.errors?.price_sale ? style.hasError : {}, style.textFieldDirection, isOutOfStockMode && Platform.OS === 'ios' && {opacity: 0.5}]}
                        selectTextOnFocus={true}
                        onChangeText={(text) => onValueChange('price_sale', filterStringToNumbers(text))}
                        onBlur={() => trackAddProductFieldFilled(trackKey + ":price_sale", valueOfPriceSale)}
                    />
                </TouchableOpacity>
            }


        </View>
    );
};

export default ProductPriceQuantityControl;
