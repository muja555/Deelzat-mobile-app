import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';

import { mainTabBarStyle as style } from './main-tab-bar.component.style';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useSelector} from "react-redux";
import {trackClickOnMainTabItem} from "modules/analytics/others/analytics.utils";
import {getMainTabsNavigatorOptions} from "v2modules/main/containers/main-tabs/main-tabs.navigator.utils";
import {appSelectors} from "modules/main/stores/app/app.store";
import MyProfileService from "v2modules/shop/containers/my-profile/my-profile.container.service";
import MainTabsNavsConst from "v2modules/main/constants/main-tabs-navs.const";
import DeelDailyContainerService from "v2modules/page/containers/deel-daily/deel-daily.container.service";
import {DzText} from "deelzat/v2-ui";
import HomeContainerService from "v2modules/page/containers/home/home.container.service";
import { shopSelectors } from 'modules/shop/stores/shop/shop.store';
import { Colors } from 'deelzat/style';

const MainTabBar = (props) => {

    const {state, descriptors, navigation} = props;

    const insets = useSafeAreaInsets();
    const isStagingApi = useSelector(appSelectors.isStagingAPISelector);

    const [MainTabsNavigatorOptions]  = useState(getMainTabsNavigatorOptions());
    const theme = useSelector(shopSelectors.themeSelector);
    const [showDeelDailyIndicator, showDeelDailyIndicatorSet] = useState(true);
    const [feedUpdateCount] = useState(Math.floor(Math.random() * 10) + 1);


    const TabButton = ({route, index}) => {
        const {options} = descriptors[route.key];

        const config = MainTabsNavigatorOptions[route.name];
        const isFocused = state.index === index;
        const isDeelDailyTab = route.name === MainTabsNavsConst.DEEL_DAILY;

        const onPress = () => {

            trackClickOnMainTabItem(route.name);
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
                data: {isFocused}
            });
            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);

                if (isDeelDailyTab && showDeelDailyIndicator) {
                    showDeelDailyIndicatorSet(false);
                }
            }

            if (isFocused) {
                if (route.name === MainTabsNavsConst.PROFILE) {
                    MyProfileService.refreshMyProfileStatus();
                }
                else if (route.name === MainTabsNavsConst.DEEL_DAILY) {
                    DeelDailyContainerService.reloadPage();
                }
                else if (route.name === MainTabsNavsConst.HOME) {
                    HomeContainerService.reloadPage();
                }
            }

        };

        const onLongPress = () => {
            navigation.emit({
                type: 'tabLongPress',
                target: route.key,
            });
        };

        const iconTintColor = !isFocused? Colors.N_BLACK:
            route.name === MainTabsNavsConst.PROFILE && theme? theme?.color1:
                Colors.MAIN_COLOR;

        const iconProps = {};
        config.iconColorProps.forEach(propKey => {
            iconProps[propKey] = iconTintColor;
        })

        return (
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                testID={route.name}
                onPress={onPress}
                onLongPress={onLongPress}
                key={route.key}
                style={style.item}>
                <View style={style.button}>
                    <View style={[style.stripe, {opacity: isFocused? 1 : 0}, isFocused && iconTintColor && {backgroundColor: iconTintColor}]} />
                    <View style={style.iconView}>
                        <config.icon {...iconProps}
                                     style={style.icon}/>
                    </View>
                    {
                        (isDeelDailyTab && showDeelDailyIndicator) &&
                        <View style={style.tabCircle}>
                            <DzText style={style.counter}>
                                +{feedUpdateCount}
                            </DzText>
                        </View>
                    }
                </View>
            </TouchableOpacity>
        );
    }

    const Buttons = state.routes.map((route, index) => <TabButton key={index} index={index} route={route}/>);

    return (
        <View style={{backgroundColor: 'white'}}>
            <View style={[
                style.innerContainer,
                insets.bottom > 0 && {
                    marginBottom: insets.bottom - style.innerContainer.paddingBottom,
                    paddingBottom: 10,
                    height: style.innerContainer.height}
            ]}>
                {Buttons}
            </View>
            {
                (isStagingApi) &&
                <View style={style.stagingIndicator}/>
            }
        </View>
    )
}

export default MainTabBar;
