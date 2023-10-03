import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TextInput, ScrollView, Keyboard, SafeAreaView} from 'react-native';

import { categoriesContainerStyle as style } from './categories.container.style';
import {ButtonOptions, Space} from "deelzat/ui";
import {Colors, LayoutStyle, LocalizedLayout} from "deelzat/style";
import IconButton from "deelzat/v2-ui/icon-button";
import BackSvg from "assets/icons/BackIcon.svg";
import I19n, {getLocale} from "dz-I19n";
import SearchIcon from "assets/icons/NewSearch.svg";
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import {useSelector} from "react-redux";
import Panel from "deelzat/v2-ui/panel";
import PanelHandle from "assets/icons/PanelHandle.svg";
import {SvgXml} from "react-native-svg";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import {DzText, Touchable} from "deelzat/v2-ui";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import {useFetch} from "v2modules/main/others/cache.utils";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";

const CategoriesContainer = () => {

    const categories = useSelector(persistentDataSelectors.categoriesSelector);
    const subCategories = useSelector(persistentDataSelectors.subCategoriesSelector);

    const [listData, listDataSet] = useState([]);
    const [searchText, searchTextSet] = useState('');

    useEffect(() => {
        const _list = categories.map((c) => {
            const subIDs = (c.children || []).filter((item) => item !== false);
            const subs = subIDs.map((item) => subCategories[item]);
            return {
                category: c,
                subs
            }
        });
        listDataSet(_list);
    }, [categories, subCategories]);

    const onPressBack = () => {
        RootNavigation.goBack();
    }

    const onPress = (category, subCategory) => {
        RootNavigation.push(MainStackNavsConst.PRODUCT_LIST, {
            category,
            subCategory,
            trackSource: {name: EVENT_SOURCE.CATEGORIES_LIST, attr1: category?.objectID, attr2: subCategory?.objectID}
        })
    };

    const CategoryView = useCallback((props) => {
        const {
            item,
            onPress
        } = props;

        const [isExpanded, isExpandedSet] = useState(!!searchText);
        const icon = useFetch(item.category.smallIcon, false);

        const title = item.category[getLocale()].title;

        const header = (
            <Touchable style={style.categoryHeader}
                       onPress={onPress}>
                {
                    (!!icon) &&
                    <View style={style.iconView}>
                        <SvgXml
                            width={24}
                            height={24}
                            xml={icon}/>
                    </View>
                }
                <Space directions={'v'} size={'md'}/>
                <Space directions={'v'}/>
                <DzText style={style.categoryTitle}>
                    {title}
                </DzText>
            </Touchable>
        );

        const subViews = (
            <View style={LayoutStyle.Row}>
                <Space directions={'v'} size={'lg'}/>
                <Space directions={'v'} size={'md'}/>
                <View style={LayoutStyle.Flex}>
                    {
                        item.subs.map((sub, index) => {
                            return (
                                <Touchable key={sub.objectID}
                                           onPress={() => onPress(item.category, sub)}
                                           style={[
                                               style.subCategoryView,
                                               {borderBottomWidth: index === item.subs.length - 1 ? 0 : 1}
                                           ]}>
                                    <DzText style={style.subCategoryTitle}>
                                        {sub[getLocale()]}
                                    </DzText>
                                    <View style={style.subCatArrow}>
                                        <PanelHandle stroke={Colors.GREY} strokeWidth={1.5} width={16} height={16}/>
                                    </View>
                                </Touchable>
                            )
                        })
                    }
                    <Space directions={'h'} size={'md'} />
                </View>
            </View>
        );

        return (
            <View style={style.categoryView}>
                <Panel header={header} isExpanded={isExpanded} onExpandCollapse={isExpandedSet}>
                    {
                        (item.subs.length > 0) && subViews
                    }
                </Panel>
            </View>
        )
    }, [searchText]);


    const categoriesList = listData.filter(item => {
        if (!searchText) {
            return true;
        }
        const matchCategoryAR = item.category['ar'].title.toLowerCase().includes(searchText.toLowerCase());
        const matchCategoryEN = item.category['en'].title.toLowerCase().includes(searchText.toLowerCase());
        const matchSubAR = !!(item.subs.filter(sub => sub['ar'].toLowerCase().includes(searchText.toLowerCase())).length);
        const matchSubEN = !!(item.subs.filter(sub => sub['en'].toLowerCase().includes(searchText.toLowerCase())).length);
        return matchCategoryAR || matchSubEN || matchCategoryEN || matchSubAR;
    }).map((item) => {
        return (
            <CategoryView key={item.category.objectID}
                          item={item}
                          onPress={() => onPress(item.category)}/>
        )
    });

    return (
        <SafeAreaView style={style.container}>
            <Space directions={'h'} size={'md'} />
            <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                <IconButton onPress={onPressBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24}/>
                </IconButton>
                <DzText style={style.title}>
                    {I19n.t('الفئات')}
                </DzText>
                <View style={style.endPlaceholder}/>
            </View>
            <Space directions={'h'} size={'md'} />
            <View style={style.inputView}>
                <SearchIcon width={20} height={20} fill={Colors.N_BLACK_50}/>
                <Space directions={'v'} size={'md'}/>
                <TextInput style={[style.inputText, LocalizedLayout.TextAlign()]}
                           direction={'ltr'}
                           placeholder={I19n.t('البحث عن فئة')}
                           onChangeText={searchTextSet}/>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}
                        onScroll={Keyboard.dismiss}>
                {categoriesList}
            </ScrollView>
        </SafeAreaView>
    );
};

export default CategoriesContainer;
