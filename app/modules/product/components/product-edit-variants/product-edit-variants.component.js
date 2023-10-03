import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Colors, LayoutStyle, LocalizedLayout} from "deelzat/style";

import {productEditVariantsStyle as style} from './product-edit-variants.component.style';
import {getMiniColorsPalette, getFullColorsPalette} from "modules/main/others/colors.utils";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import {FormStyle} from "deelzat/style";
import ColorsPalette from "modules/main/components/colors-palette/colors-palette.component";
import ColorSelectorModal from "modules/main/modals/color-selector/color-selector.modal";
import {useDispatch, useSelector} from "react-redux";
import {productActions, productSelectors} from "modules/product/stores/product/product.store";
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import {Radio} from "deelzat/form";
import ProductAddStepConst from "modules/product/constants/product-add-step.const";
import BackSvg from "assets/icons/ArrowRight.svg";
import {trackAddProductFieldFilled} from "modules/analytics/others/analytics.utils";
import I19n, {getLocale} from 'dz-I19n';
import {DzText} from "deelzat/v2-ui";

const ProductEditVariants = (props) => {

    const {
        onNext = () => {
        },
    } = props;

    const MiniColorsPalette = getMiniColorsPalette();
    const FullColorsPalette = getFullColorsPalette();
    const dispatch = useDispatch();

    const allFields = useSelector(persistentDataSelectors.fieldsSelector);
    const productState = useSelector(productSelectors.productStateSelector);

    const [isColorSelectorModalVisible, isColorSelectorModalVisibleSet] = useState(false);
    const [hasVariance, hasVarianceSet] = useState(false);
    const [sizes, sizesSet] = useState([]);
    const [disabled, disabledSet] = useState(true);

    const onColorsPaletteChange = (value) => {
        dispatch(productActions.SetData({
            colors: value
        }));
        trackAddProductFieldFilled('colors', value.map(color => color.title))
    };

    const onSizeSelect = (size) => {
        dispatch(productActions.SetData({
            size: size
        }));
        trackAddProductFieldFilled('size', size?.title)
    };

    const selectedColorsContent = productState.colors.map((item) => {
        const borderColor = item.color === '#ffffff' ? Colors.GREY : item.color;
        return (
            <View key={item.color}
                  style={[style.selectedColorThumb, {backgroundColor: item.color, borderColor: borderColor}]}/>
        );
    });

    useEffect(() => {
        if (productState.referenceCategory) {

            const _hasVariance = !!productState.referenceCategory.has_variance;
            hasVarianceSet(_hasVariance);

            const hasTarget = !!productState.referenceCategory.has_target;

            let sizeFields = [];

            if (productState.referenceCategory.size_fields && Array.isArray(productState.referenceCategory.size_fields)) {
                sizeFields = productState.referenceCategory.size_fields.map((item) => allFields[item]);
            }

            if (hasTarget) {
                const targetLabel = productState?.target?.label;
                sizeFields = sizeFields
                    .filter((item) => item.hasOwnProperty('target') && item.target.indexOf(targetLabel) > -1)
            } else {
                sizeFields = sizeFields
                    .filter((item) => !item.hasOwnProperty('target'))

            }

            sizesSet(sizeFields);

            let _disabled = false;
            if (_hasVariance && productState.colors.length === 0) {
                _disabled = true;
            } else if (sizeFields.length > 0 && !productState.size) {
                _disabled = true;
            } else if (sizeFields.length > 0 && productState.size && !sizeFields.find((item) => item.name === productState.size.name)) {
                _disabled = true;
            }

            disabledSet(_disabled);
        }

    }, [allFields, productState]);

    return (
        <View style={style.container}>
            <ScrollView>
                {
                    hasVariance &&
                    <>
                        <ColorSelectorModal
                            isVisible={isColorSelectorModalVisible}
                            onHide={() => {
                                isColorSelectorModalVisibleSet(false)
                            }}
                            selected={productState.colors}
                            onChange={onColorsPaletteChange}
                            colors={FullColorsPalette}/>

                        <Space size={'lg'} directions={'h'}/>
                        <View style={style.colorTitleView}>
                            <DzText style={FormStyle.label}> {I19n.t('اللون')} </DzText>
                            <View style={style.selectedView}>
                                {selectedColorsContent}
                            </View>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    isColorSelectorModalVisibleSet(true)
                                }}
                            >
                                <DzText style={style.moreColorsLink}> {I19n.t('المزيد من الألوان')} </DzText>
                            </TouchableOpacity>

                        </View>
                        <Space directions={'h'}/>
                        <ColorsPalette
                            selected={productState.colors}
                            onChange={onColorsPaletteChange}
                            colors={MiniColorsPalette.concat(productState.colors.filter((item) => !item.hasOwnProperty('miniSort')))}/>
                        <Space size={'lg'} directions={'h'}/>

                    </>
                }

                {
                    (!hasVariance && sizes.length === 0) &&
                    <View>
                        <Space size={'lg'} directions={'h'}/>
                        <DzText
                            style={style.noOptionsMessage}>{I19n.t('لا يتوفر خيار الألوان والمقاسات لهذا المنتج')}</DzText>
                    </View>
                }

                {
                    (sizes.length > 0) &&
                    <Space size={'lg'} directions={'h'}/>
                }

                <Radio
                    errorMessage={''}
                    keyBy={'name'}
                    labelBy={getLocale()}
                    descriptionBy={`description_${getLocale()}`}
                    label={''}
                    options={sizes}
                    value={productState.size}
                    onChange={onSizeSelect}
                />
            </ScrollView>
            <Space directions={'h'} size={'md'}/>
            <Button
                onPress={() => onNext(ProductAddStepConst.PRICES)}
                disabled={disabled}
                type={ButtonOptions.Type.PRIMARY}
                separated={true}
                icon={
                    <View style={LocalizedLayout.ScaleX()}>
                        <BackSvg fill={'#fff'} width={15} height={15}/>
                    </View>
                }
                text={I19n.t('التالي')}/>
            <Space directions={'h'} size={'lg'}/>
        </View>
    );
};

export default ProductEditVariants;
