import React, {memo, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';

import { productFiltersContainerStyle as style } from './product-filters.container.style';
import {ButtonOptions, Space} from "deelzat/ui";
import isEqual from 'lodash/isEqual';
import IconButton from "deelzat/v2-ui/icon-button";
import BackSvg from "assets/icons/BackIcon.svg";
import {Colors, LocalizedLayout, Spacing} from "deelzat/style";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import I19n, {getLocale} from "dz-I19n";
import {
    SelectValueList,
    Touchable,
    SelectValueGrid,
    SelectValueRow,
    SelectValueRowScroll,
    DzText,
    ExpandableView
} from "deelzat/v2-ui";
import ColorsPalette from "v2modules/shared/components/colors-palette/colors-palette.component";
import {countFilters} from "modules/browse/others/filters.utils";
import omit from "lodash/omit";
import {trackFilterChanged} from "modules/analytics/others/analytics.utils";
import ProductFiltersService from "v2modules/product/others/product-filters.service";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useSelector} from "react-redux";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";

const ProductFiltersContainer = (props) => {
    const {
        filters = [],
        selectedFilters = {},
        productsListId
    } = props.route.params;

    const insets = useSafeAreaInsets();
    const currencyCode = useSelector(geoSelectors.currencyCodeSelector);
    const [selectedValues, selectedValuesSet] = useState(selectedFilters);

    const onChangeFilters = (filterName, filters) => {
        selectedValuesSet(_thisSelectedFilters => {
             _thisSelectedFilters = omit(_thisSelectedFilters, filterName);
            if (filters.length) {
                _thisSelectedFilters[filterName] = filters;
            }
            return _thisSelectedFilters;
        });
        trackFilterChanged(filterName, filters);
    }


    const locale = getLocale();
    const populateFilters = filters.map((field) => {
        const selectedFieldFilters = selectedValues[field.name] || [];

        return (
            <View key={field.name}
                  style={[field.name !== 'price' && {paddingEnd: Spacing.HorizontalPadding.paddingEnd},
                      {paddingStart: Spacing.HorizontalPadding.paddingStart}
                  ]}>
                <DzText style={style.sectionLabel}>
                    {field[locale]}
                </DzText>
                <Space directions={'h'} sizes={'md'} />
                <FilterView selectedFieldFilters={selectedFieldFilters}
                            field={field}
                            currencyCode={currencyCode}
                            onChangeFilters={onChangeFilters}/>
                <Space directions={'h'} sizes={'lg'} />
                <Space directions={'h'} />
            </View>
        )
    })

    const onPressApply = () => {
        ProductFiltersService.emitFiltersChanged({
            selectedValues,
            productsListId: productsListId
        });
        RootNavigation.goBack();
    }

    const onPressReset = () => {
        selectedValuesSet({});
    }

    const filterCount = countFilters(selectedValues);
    return (
        <SafeAreaView style={style.container}>
            <Space directions={'h'} size={'md'} />
            <View style={style.header}>
                <IconButton onPress={RootNavigation.goBack}
                            btnStyle={[style.backButton, LocalizedLayout.ScaleX()]}
                            type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24}/>
                </IconButton>
                <View style={style.midHeader}
                      pointerEvents="none">
                    <DzText style={style.title}>
                        {I19n.t('الفلاتر')}
                    </DzText>
                    {
                        (filterCount > 0) &&
                        <View style={style.headerCountView}>
                            <DzText style={style.headerCount}>
                                {filterCount}
                            </DzText>
                        </View>
                    }
                </View>
                <Touchable onPress={onPressReset}>
                    <DzText style={style.resetText}>
                        {I19n.t('حذف الفلاتر')}
                    </DzText>
                </Touchable>
            </View>
            <Space directions={'h'} size={'md'} />
            <Space directions={'h'} size={'sm'}/>
            <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={style.scrollView}
                        bounces={false}>
                {populateFilters}
            </ScrollView>
            <View style={[style.bottomView, {paddingBottom:
                    insets.bottom || 20}]}>
                <Touchable onPress={RootNavigation.goBack}
                           style={style.cancelBtn}>
                    <DzText style={style.cancelText}>
                        {I19n.t('إلغاء')}
                    </DzText>
                </Touchable>
                <Touchable onPress={onPressApply}
                           style={style.applyBtn}>
                    <DzText style={style.applyText}>
                        {I19n.t('حفظ')}
                    </DzText>
                </Touchable>
            </View>
        </SafeAreaView>
    );
};

export default ProductFiltersContainer;



const FilterView = memo((props) => {
    const {
        field,
        selectedFieldFilters,
        onChangeFilters,
        currencyCode,
    } = props;


    const [isSizeFieldExpanded, isSizeFieldExpandedSet] = useState(false);

    const onChange = (items) => onChangeFilters(field.name, items);
    const locale = getLocale();

    switch (field.name) {
        case 'target':
            return (
                <SelectValueRow options={field.options}
                                value={selectedFieldFilters}
                                onChange={onChange}
                                keyBy={'value'}
                                labelBy={'title'}/>
            )
        case 'price':
            return (
                <SelectValueRowScroll options={field.options}
                                      value={selectedFieldFilters}
                                      onChange={onChange}
                                      keyBy={'value'}
                                      labelPostfix={' ' + currencyCode}
                                      labelBy={'title'}/>
            )
        case 'color':
            return (
                <ColorsPalette
                    onChange={onChange}
                    selected={selectedFieldFilters}
                    colors={field.options} />

            )
        case 'sort':
            return (
                <SelectValueList options={field.options}
                                 value={selectedFieldFilters}
                                 onChange={onChange}
                                 multi={false}
                                 keyBy={'value'}
                                 labelBy={'title'}/>
            )
        case 'size':
            return (
                <ExpandableView
                    collapseHeight={100}
                    isExpanded={isSizeFieldExpanded}
                    onExpandCollapse={isSizeFieldExpandedSet}>
                    <SelectValueGrid options={field.options}
                                     value={selectedFieldFilters}
                                     onChange={onChange}
                                     keyBy={'value'}
                                     labelBy={locale}/>
                </ExpandableView>
            )
        default:
            return (
                <SelectValueGrid options={field.options}
                                 value={selectedFieldFilters}
                                 onChange={onChange}
                                 keyBy={'value'}
                                 labelBy={locale}/>
            )
    }

}, (prevProps, nextProps) => {
    const sameName = prevProps.field.name === nextProps.field.name;
    const sameValues = isEqual(prevProps.selectedFieldFilters, nextProps.selectedFieldFilters);
    return sameName && sameValues;
});
