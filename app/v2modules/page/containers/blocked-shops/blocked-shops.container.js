import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, Image } from 'react-native';

import { blockedShopsContainerStyle as style } from './blocked-shops.container.style';
import { Space } from 'deelzat/ui';
import { Colors, LayoutStyle, Spacing } from 'deelzat/style';
import I19n from 'dz-I19n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PageHeader from 'v2modules/shared/components/page-header/page-header.component';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'v2modules/shop/stores/blocked-shops/blocked-shops.actions';
import {blockedShopsSelectors } from 'v2modules/shop/stores/blocked-shops/blocked-shops.store';
import ShopApi from 'v2modules/shop/apis/shop.api';
import { DzText, Touchable } from 'deelzat/v2-ui';
import FrameIcon from 'assets/icons/ImageFrameSmall.png';
import ShopImage from 'v2modules/shop/components/shop-image/shop-image.component';
import { trackBlockShopStateChange } from 'modules/analytics/others/analytics.utils';

const BlockedShopsContainer = () => {

    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const blockedShops = useSelector(blockedShopsSelectors.blockedShopIdsSelector);
    const [shops, shopsSet] = useState([]);

    useEffect(() => {
        ShopApi.getShopsById(blockedShops)
            .then((result) => {
                const _shops = [];
                blockedShops.map(shopId => {
                    const corrShop = result.find(shop => shop.id === shopId);
                    _shops.push(corrShop);
                })

                shopsSet(_shops);
            })
            .catch(console.warn);

    }, [blockedShops]);


    const renderItem = useCallback(({item, index}) => {

        const onPressRemoveBlock = () => {
            dispatch(Actions.RemoveBlockedShopId(item?.shopId));
            trackBlockShopStateChange(false, item);
        }


        return (
            <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                <View style={style.imageView}>
                    <Image style={style.frame} source={FrameIcon} tintColor={Colors.MAIN_COLOR} />
                    <ShopImage image={item.picture} resizeMethod='scale' style={style.profileImage} />
                </View>
                <Space directions={'v'} size={'md'} />
                <DzText style={style.shopName}>
                    {item.name}
                </DzText>
               <Touchable style={style.blockBtn} onPress={onPressRemoveBlock}>
                   <DzText style={style.blockBtnText}>
                       {I19n.t('إلغاء الحجب')}
                   </DzText>
               </Touchable>
            </View>
        )
    }, []);

    const ListHeader = useCallback(() => {
        return (
            <Space directions={'h'} size={'lg'} />
        );
    }, []);

    const keyExtractor = useCallback(item => item.id)

    return (
        <View style={[style.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={Spacing.HorizontalPadding}>
                <Space directions={'h'} size={'md'} />
                <PageHeader title={I19n.t('الحسابات المحجوبة')} titleStyle={{color: Colors.MAIN_COLOR}}/>
            </View>
            <FlatList data={shops}
                      renderItem={renderItem}
                      contentContainerStyle={style.blockedList}
                      showsVerticalScrollIndicator={false}
                      ListHeaderComponent={ListHeader}
                      keyExtractor={keyExtractor}
            />
        </View>
    );
};

export default BlockedShopsContainer;
