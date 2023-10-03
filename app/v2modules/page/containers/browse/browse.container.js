import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';

import { browseContainerStyle as style } from './browse.container.style';
import Activities from "v2modules/widget/components/activities/activities.component";
import WidgetDataFilterCont from "v2modules/widget/constants/widget-data-filter.cont";
import {useSelector} from "react-redux";
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import {Touchable} from "deelzat/v2-ui";
import CategoryHeroIcon from "v2modules/product/components/category-hero-icon/category-hero-icon.component";
import {Space} from "deelzat/ui";
import I19n, {isRTL} from "dz-I19n";
import Heading, {HeadingTypes} from "deelzat/v2-ui/heading";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {LayoutStyle, Spacing} from "deelzat/style";
import  * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import SearchBar from "v2modules/search/components/search-bar/search-bar.component";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import useSubCategoriesModal from "v2modules/product/modals/sub-categories/sub-categories.modal";
import FloatingAddProductButton
    from "v2modules/main/components/floating-add-product-button/floating-add-product-button.component";
import COMPONENTS_PAGE from "modules/main/constants/components-pages.const";

import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import WillShowToast from "deelzat/toast/will-show-toast";

const SubCategoriesModal = useSubCategoriesModal();

const BrowseContainer = () => {

    const categories = useSelector(persistentDataSelectors.categoriesSelector);
    const insets = useSafeAreaInsets();

    const onPressViewCategories = () => {
        RootNavigation.push(MainStackNavsConst.CATEGORIES);
    }

    const onSelectSubCategory = (category, subCategory) => {
        SubCategoriesModal.show(false);
        RootNavigation.push(MainStackNavsConst.PRODUCT_LIST, {
            category,
            subCategory,
            trackSource: {name: EVENT_SOURCE.BROWSE, attr1: category?.objectID, attr2: subCategory?.objectID}
        });
    }

    const renderCategories = categories.map((item, index) => {
        return (
            <Touchable key={item.objectID}
                       onPress={() => onPressCategory(item)}
                       style={LayoutStyle.Row}>
                <Space directions={'v'} size={'md'}/>
                <CategoryHeroIcon category={item} viewStyle={[style.categoryItem, !isRTL() && {width: 74}]}/>
                <Space directions={'v'} size={'md'}/>
            </Touchable>
        )
    });


    const onPressCategory = (item) => {
        const children = (item.children || []).filter((item) => item !== false);
        if (children.length) {
            SubCategoriesModal.setOptions({
                category: item,
            });
            SubCategoriesModal.show(true);
        }
        else {
            RootNavigation.push(MainStackNavsConst.PRODUCT_LIST, {
                category: item,
            });
        }
    };

    const renderActivitiesHeader = useCallback(() => {
        return (
            <View style={{marginTop: insets.top}}>
                <Space directions={'h'} size={'md'}/>
                <View style={Spacing.HorizontalPadding}>
                    <SearchBar />
                </View>
                <Space directions={'h'} size={'md'}/>
                {
                    (categories.length > 0) &&
                    <>
                        <View style={Spacing.HorizontalPadding}>
                            <Heading type={HeadingTypes.H2} linkText={I19n.t('المزيد')}
                                     onLinKPress={onPressViewCategories}>
                                {I19n.t('تسوق حسب الفئة')}
                            </Heading>
                        </View>
                        <Space directions={'h'} size={'md'}/>

                        <ScrollView horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    bounces={false}>
                            {renderCategories}
                        </ScrollView>
                    </>
                }
                {
                    (isRTL()) &&
                    <Space directions={'h'} size={'md'}/>
                }
                <View style={Spacing.HorizontalPadding}>
                    <Heading type={HeadingTypes.H2}>
                        {I19n.t('أنشطة')}
                    </Heading>
                </View>
                <Space directions={'h'} size={'md'}/>
            </View>
        )
    }, [categories, insets.top]);

    return (
        <View style={style.container}
              testID="main-page">
            <FloatingAddProductButton trackingPageName={COMPONENTS_PAGE.BROWSE}/>
            <Activities componentFilter={WidgetDataFilterCont.BROWSE_PAGE_ACTIVITY}
                        ListHeaderComponent={renderActivitiesHeader}/>
            <SubCategoriesModal.Modal
                onSelect={onSelectSubCategory}
                onHide={() => {SubCategoriesModal.show(false)}}/>
        </View>
    )
};

export default BrowseContainer;
