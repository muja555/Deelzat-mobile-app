import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { mainTabsContainerStyle as style } from './main-tabs.container.style';
import BrowseContainer from 'v2modules/page/containers/browse/browse.container';
import MainTabsNavsConst from 'v2modules/main/constants/main-tabs-navs.const';
import HomeContainer from 'v2modules/page/containers/home/home.container';
import { screenListener } from 'modules/analytics/others/analytics.utils';
import MainTabBar from 'v2modules/main/components/main-tab-bar/main-tab-bar.component';
import MyProfileContainer from 'v2modules/shop/containers/my-profile/my-profile.container';
import DeelDailyContainer from 'v2modules/page/containers/deel-daily/deel-daily.container';
import ShopsContainer from 'v2modules/page/containers/shops/shops.container';
import DeepLinksRouter from 'modules/root/components/deeplinks-router/deeplinks-router.component';
import WillShowToast from 'deelzat/toast/will-show-toast';

const Tab = createBottomTabNavigator();

const MainTabsContainer = () => {

    return (
        <View style={style.container}>
            <DeepLinksRouter />
            <Tab.Navigator
                initialRouteName={MainTabsNavsConst.HOME}
                screenOptions={{
                    animationEnabled: true,
                    headerShown: false,
                    useNativeDriver: true,
                    lazy: false,
                }}
                tabBar={props => <MainTabBar {...props} />}>

                <Tab.Screen
                    listeners={screenListener}
                    name={MainTabsNavsConst.HOME}
                    component={HomeContainer} />

                <Tab.Screen
                    listeners={screenListener}
                    name={MainTabsNavsConst.DEEL_DAILY}
                    component={DeelDailyContainer} />

                <Tab.Screen
                    listeners={screenListener}
                    name={MainTabsNavsConst.BROWSE}
                    component={BrowseContainer} />

                <Tab.Screen
                    listeners={screenListener}
                    name={MainTabsNavsConst.SHOPS}
                    component={ShopsContainer} />

                <Tab.Screen
                    listeners={screenListener}
                    lazy={false}
                    name={MainTabsNavsConst.PROFILE}
                    component={MyProfileContainer} />

            </Tab.Navigator>
            <WillShowToast id={'main-toast'}/>
        </View>
    );
};

export default MainTabsContainer;
