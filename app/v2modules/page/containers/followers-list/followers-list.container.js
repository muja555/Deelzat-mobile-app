import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';

import { followersListContainerStyle as style } from './followers-list.container.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ShopFollowingListGetInput from 'modules/shop/inputs/shop-following-list-get-input';
import ShopApi from 'modules/shop/apis/shop.api';
import ShopApiV2 from 'v2modules/shop/apis/shop.api';
import { ButtonOptions, Space } from 'deelzat/ui';
import { Colors, LayoutStyle, LocalizedLayout } from 'deelzat/style';
import IconButton from 'deelzat/v2-ui/icon-button';
import BackSvg from 'assets/icons/BackIcon.svg';
import { DzText, Touchable } from 'deelzat/v2-ui';
import SpacingStyle from 'deelzat/style/spacing';
import { createMaterialTopTabNavigator } from '@deelzat/material-top-tabs';
import { screenListener } from 'modules/analytics/others/analytics.utils';
import FollowersListTabBarConst from './followers-list-tab-bar.const';
import TopTabBar from 'v2modules/shared/components/top-tab-bar/top-tab-bar.component';
import { getTabsOptions } from './followers-list.container.utils';
import ShopImage from 'v2modules/shop/components/shop-image/shop-image.component';
import { routeToShop } from 'modules/root/components/deeplinks-router/deeplinks-router.utils';
import EVENT_SOURCE from 'modules/analytics/constants/analytics-event-source.const';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import uniq from 'lodash/uniq';

const Tab = createMaterialTopTabNavigator();
const FollowersListContainer = (props) => {

    const {
        shop = {},
        initialTab = FollowersListTabBarConst.FOLLOWING,
    } = props.route.params;

    const insets = useSafeAreaInsets();
    const [tabConfigs] = useState(getTabsOptions());


    const ListTab = useCallback((props) => {
        const {
            tabKey,
        } = props?.route?.params || props;

        const [page, pageSet] = useState(1);
        const [fetchMore, fetchMoreSet] = useState(true);

        const [isLoading, isLoadingSet] = useState(true);
        const [list, listSet] = useState([]);


        const requestList = (results = [], isFollowersList) => {

            const index = isFollowersList? 'shopId': 'id';
            const shopIds = uniq(results.map(result => result[index]));

            if (shopIds?.length > 0) {
                ShopApiV2.getShopsById(shopIds)
                    .then(shops => {

                        const res = results.map((result) => {
                            const algoliaShop = shops?.find(_s => _s.id === result[index]);
                            if (algoliaShop) {
                                result.name = algoliaShop?.name;
                                result.title = '';
                                result.userFirstName = '';
                                result.userLastName = '';
                                result.picture = algoliaShop.picture;
                            }
                            return result;
                        });


                        listSet(old => [...old, ...res]);
                        fetchMoreSet(res.length > 0);
                    })
                    .finally(() => {
                        isLoadingSet(false);
                    })
                    .catch(console.warn);
            } else {

                listSet(old => [...old, ...results]);
                fetchMoreSet(results.length > 0);
                isLoadingSet(false);
            }
        }

        useEffect(() => {
            if (!shop) {
                return;
            }

            const inputs = new ShopFollowingListGetInput();
            inputs.shop_id = shop.id;
            inputs.page = page;
            inputs.page_size = 50;
            if (tabKey === FollowersListTabBarConst.FOLLOWING) {

                ShopApi.getFollowingList(inputs)
                    .then((result) => {
                        requestList(result?.shops || [], false);
                    })
                    .catch(console.warn);

            } else if (tabKey === FollowersListTabBarConst.FOLLOWERS) {

                ShopApi.getFollowersList(inputs)
                    .then((result) => {
                        requestList(result?.users || [], true);
                    })
                    .catch(console.warn);

            }
        }, [page]);


        const renderItem = useCallback(({ item, index }) => {

            const onPress = () => {
                const shopId = tabKey === FollowersListTabBarConst.FOLLOWERS? item.shopId: item.id;
                const trackSource = { name: EVENT_SOURCE.FOLLOWING_LIST, attr1: shopId, attr2: item.name || item.title };
                routeToShop(item, null, trackSource);
            };


            let displayTitle = item.name || item.title;
            if (item.userFirstName || item.userLastName) {
                displayTitle = `${item.userFirstName ?? ''} ${item.userLastName ?? ''}`.trim();
            }

            return (
                <Touchable disabled={tabKey === FollowersListTabBarConst.FOLLOWERS && !item.shopId}
                           onPress={onPress} style={style.resultRow}>
                    <ShopImage image={item.picture}
                               style={style.resultImage} />
                    <Space directions={'v'} size={'md'} />
                    <Space directions={'v'} />
                    <DzText numberOfLines={2}
                            style={[style.resultTitle, LocalizedLayout.TextAlignRe()]}>
                        {displayTitle}
                    </DzText>
                </Touchable>
            );
        }, []);

        const ItemSeparatorComponent = useCallback(() => <Space directions={'h'} />, []);
        const ListHeaderComponent = useCallback(() => <Space directions={'h'} size={['sm', 'md']} />, []);
        const keyExtractor = useCallback((item, index) => `${index}`, []);

        const ListFooterComponent = useCallback(() => (
            <View>
                <Space directions={'h'} size={['sm', 'md']} />
                <ActivityIndicator style={style.footerLoader}
                                   size="small"
                                   color={fetchMore? Colors.MAIN_COLOR : 'transparent'} />
                <Space directions={'h'} size={['sm', 'md']} />
            </View>
        ), [fetchMore]);

        const onEndReached = useCallback(() => {
            if (fetchMore) {
                pageSet(page + 1);
            }
        }, [fetchMore, page]);

        return (
            <View style={style.container}>
                {
                    (isLoading) &&
                    <View style={style.bigLoader}>
                        <ActivityIndicator style={style.loadingView} size='small' color={Colors.MAIN_COLOR} />
                    </View>
                }
                {
                    (!isLoading) &&
                    <FlatList
                        data={list}
                        bounces={false}
                        renderItem={renderItem}
                        contentContainerStyle={style.listTab}
                        ItemSeparatorComponent={ItemSeparatorComponent}
                        ListHeaderComponent={ListHeaderComponent}
                        onEndReached={onEndReached}
                        ListFooterComponent={ListFooterComponent}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={keyExtractor}
                    />
                }
            </View>
        );
    }, []);


    return (
        <View style={[style.container, { paddingTop: insets.top }]}>
            <Space directions={'h'} size={'md'} />
            <View style={[LayoutStyle.Row, SpacingStyle.HorizontalPadding]}>
                <IconButton onPress={RootNavigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]}
                            type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24} />
                </IconButton>
                <DzText style={style.title}>
                    {shop?.name || ''}
                </DzText>
                <View style={style.endPlaceholder} />
            </View>
            <Space directions={'h'} size={'lg'} />
            <Tab.Navigator
                tabBar={(props) => <TopTabBar {...props} tabConfigs={tabConfigs} />}
                screenOptions={{ animationEnabled: true, useNativeDriver: true, swipeEnabled: true }}
                initialRouteName={initialTab}
                useNativeDriver={true}>
                <Tab.Screen key={FollowersListTabBarConst.FOLLOWING}
                            name={FollowersListTabBarConst.FOLLOWING}
                            initialParams={{
                                tabKey: FollowersListTabBarConst.FOLLOWING,
                            }}
                            listeners={screenListener}
                            component={ListTab} />
                <Tab.Screen key={FollowersListTabBarConst.FOLLOWERS}
                            name={FollowersListTabBarConst.FOLLOWERS}
                            initialParams={{
                                tabKey: FollowersListTabBarConst.FOLLOWERS,
                            }}
                            listeners={screenListener}
                            component={ListTab} />
            </Tab.Navigator>
        </View>
    );
};

export default FollowersListContainer;
