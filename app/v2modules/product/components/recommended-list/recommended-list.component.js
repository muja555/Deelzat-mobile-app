import React, {useCallback} from 'react';
import {View, FlatList, Dimensions} from 'react-native';

import { recommendedListStyle as style } from './recommended-list.component.style';
import I19n from 'dz-I19n';
import ImageWithBlur from "deelzat/v2-ui/image-with-blur";
import {Space} from "deelzat/ui";
import {DzText, Touchable} from "deelzat/v2-ui";
import ImagePreviewModalService from "v2modules/shared/modals/image-preview/image-preview.modal.service";
import {refactorImageUrl} from "modules/main/others/main-utils";

const SCREEN_WIDTH = Dimensions.get('window').width;

// Item width related to screen width
const ITEM_SCALE_WIDTH = 140 / 375;
const ITEM_WIDTH = ITEM_SCALE_WIDTH * SCREEN_WIDTH;
// Item dimensions design scale
const ITEM_SCALE = 110 / 155;
const ITEM_HEIGHT = ITEM_WIDTH / ITEM_SCALE;

const RecommendedList = (props) => {
    const {
        recommendations = [],
        currencyCode = '',
        onPressItem = (item, index) => {}
    } = props;

    const renderItem = useCallback(({item, index}) => {

        const onLongPress = () => {
            ImagePreviewModalService.setVisible({
                show: true,
                imageUrl: item?.image
            });
        }

        const onPressOut = () => {
            ImagePreviewModalService.setVisible({
                show: false
            });
        }

        return (
            <Touchable style={[style.itemContainer, {width: ITEM_WIDTH, height: ITEM_HEIGHT}]}
                       onLongPress={onLongPress}
                       onPressOut={onPressOut}
                       onPress={() => onPressItem(item, index)}>
                <ImageWithBlur
                    attatchToObj={item}
                    style={[style.image, {height: ITEM_HEIGHT - 67}]}
                    resizeMode="cover"
                    resizeMethod="resize"
                    thumbnailUrl={refactorImageUrl(item?.image, 1)}
                    imageUrl={refactorImageUrl(item?.image, ITEM_WIDTH)}/>
                <View style={[style.itemInfoView, {height: 67}]}>
                    <View style={style.itemTitleView}>
                        <DzText style={style.itemTitle} numberOfLines={2}>
                            {item.title}
                        </DzText>
                    </View>
                    <DzText style={style.itemPrice}>
                        {`${item.price} ${currencyCode}`}
                    </DzText>
                </View>
            </Touchable>
        )
    }, []);

    const keyExtractor = useCallback((item) => `${item.id}`, []);

    const renderSeparator = useCallback(() => {
        return (
            <View style={style.listSeparator}/>
        )
    }, []);


    if (!recommendations?.length)
        return (
            <View style={{height: 200}}/>
        )

    return (
        <View style={style.container}>
            <View style={{height: 40}}/>
            <View style={style.separator}/>
            <Space directions={'h'}/>
            <Space directions={'h'} size={'md'}/>
            <View style={style.header}>
                <DzText style={style.title}>
                    {I19n.t('منتجات ذات صلة')}
                </DzText>
            </View>
            <Space directions={'h'} size={'md'}/>
            <Space directions={'h'} />
            <FlatList data={recommendations}
                      contentContainerStyle={style.innerContainer}
                      initialNumToRender={3}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={renderItem}
                      initialScrollIndex={0}
                      ItemSeparatorComponent={renderSeparator}
                      ListFooterComponent={renderSeparator}
                      ListHeaderComponent={renderSeparator}
                      keyExtractor={keyExtractor} />
        </View>
    );
};

export default RecommendedList;
