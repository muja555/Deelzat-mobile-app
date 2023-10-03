import React, {useCallback, useState} from 'react';
import {View, Text, FlatList, Keyboard, ActivityIndicator} from 'react-native';

import { searchResultsStyle as style } from './search-results.component.style';
import AlgoliaIndicesConst from "modules/main/constants/algolia-indices.const";
import {DzText, ImageWithBlur, Touchable} from "deelzat/v2-ui";
import I19n, {isRTL} from "dz-I19n";
import {Space} from "deelzat/ui";
import {refactorImageUrl} from "modules/main/others/main-utils";
import ShopImage from "v2modules/shop/components/shop-image/shop-image.component";
import EmptyResults from "assets/icons/EmptyResults.svg";
import {Colors, LocalizedLayout} from "deelzat/style";
import NothingFoundEN from 'assets/icons/NothingFoundEN.svg';
import ImagePreviewModalService from "v2modules/shared/modals/image-preview/image-preview.modal.service";


const SearchResults = (props) => {
    const {
        results = {},
        isLoading = false,
        onItemPress = () => {},
        onPressShowMore = () => {},
    } = props;

    const [selectedTab, selectedTabSet] = useState(AlgoliaIndicesConst.PRODUCTS);

    const LoadingView = useCallback(() => {
        return (
            <ActivityIndicator style={style.loadingView} size="large" color={Colors.MAIN_COLOR} />
        )
    }, []);


    const ListEmptyComponent = useCallback(() => {
            return (
                <View style={style.emptyResults}>
                    <View>
                        <View style={{alignSelf: isRTL()? 'flex-start': 'flex-end'}}>
                            <EmptyResults />
                        </View>
                        {
                            (isRTL()) &&
                            <DzText style={style._emptyTextBigAR}>
                                {I19n.t('لا يوجد نتائج بحث')}
                            </DzText>
                        }
                        {
                            (!isRTL()) &&
                           <NothingFoundEN />
                        }
                    </View>
                    <Space directions={'h'} size={'sm'} />
                    <Space directions={'h'} />
                    <DzText style={style._emptyText}>
                        {I19n.t('ما تقلق، عنا منتجات كثير وللكل.')}
                    </DzText>
                    <DzText style={style._emptyText}>
                        {I19n.t('تأكد من إسم المنتج المدخل وإستمتع بالشراء')}
                    </DzText>
                </View>
            )
    }, []);

    const renderItem = useCallback(({item, index}) => {

        const onPress = () => onItemPress(item);
        const onLongPress = () => {
            ImagePreviewModalService.setVisible({
                show: true,
                asRectangle: item.picture,
                imageUrl: item.picture || item.image
            });
        }

        const onPressOut = () => {
            ImagePreviewModalService.setVisible({
                show: false
            });
        }

        return (
            <Touchable onPress={onPress} style={style.resultRow} onLongPress={onLongPress} onPressOut={onPressOut}>
                {
                    (item.picture)?
                        <ShopImage image={item.picture}
                                   style={style.resultImage}/>
                        :
                        <ImageWithBlur style={style.resultImage}
                                       resizeMode='cover'
                                       resizeMethod="resize"
                                       thumbnailUrl={refactorImageUrl(item.image, 1)}
                                       imageUrl={refactorImageUrl(item.image, style.resultImage.width * 0.8)}/>
                }
                <Space directions={'v'} size={'md'}/>
                <Space directions={'v'}/>
                <DzText numberOfLines={2}
                      style={style.resultTitle}>
                    {item.name || item.title}
                </DzText>
            </Touchable>
        )
    }, []);

    const ListFooterComponent = (
        <Touchable onPress={onPressShowMore}>
            <Space directions={'h'} size={'md'}/>
            <DzText style={[style.showMore, LocalizedLayout.TextAlignRe()]}>
                {I19n.t('أظهر المزيد')}
            </DzText>
        </Touchable>
    );

    const keyExtractor = (item, index) => `${item.title}_${index}`;
    return (
        <View style={style.container}>
            <View style={style.resultsTabs}>
                <Touchable onPress={() => selectedTabSet(AlgoliaIndicesConst.PRODUCTS)}>
                    <DzText style={[
                        style.resultTabText,
                        selectedTab === AlgoliaIndicesConst.PRODUCTS && style.resultTabTextSelected
                    ]}>
                        {I19n.t('المنتجات')}
                    </DzText>
                </Touchable>
                <View style={style.tabSpace}/>
                <Touchable onPress={() => selectedTabSet(AlgoliaIndicesConst.SHOPS)}>
                    <DzText style={[
                        style.resultTabText,
                        selectedTab === AlgoliaIndicesConst.SHOPS && style.resultTabTextSelected
                    ]}>
                        {I19n.t('المتاجر')}
                    </DzText>
                </Touchable>
            </View>
            <FlatList data={results[selectedTab]}
                      renderItem={renderItem}
                      showsVerticalScrollIndicator={false}
                      ItemSeparatorComponent={() => <Space directions={'h'} size={'sm'}/>}
                      ListEmptyComponent={isLoading? LoadingView: ListEmptyComponent}
                      ListHeaderComponent={<Space directions={'h'} size={'md'}/>}
                      ListFooterComponent={results[selectedTab]?.length > 0 && selectedTab === AlgoliaIndicesConst.PRODUCTS? ListFooterComponent: undefined}
                      contentContainerStyle={{ minHeight: '100%'}}
                      keyboardShouldPersistTaps={'handled'}
                      onScroll={Keyboard.dismiss}
                      keyExtractor={keyExtractor}/>
        </View>
    );
};

export default SearchResults;
