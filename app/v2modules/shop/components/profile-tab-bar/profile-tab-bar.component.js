import React, { useState } from 'react';
import {View, Text, Dimensions} from 'react-native';

import { profileTabsStyle as style } from './profile-tab-bar.component.style';
import {getProfileTabOptions} from "./profile-tab-bar.component.utils";
import {DzText, Touchable} from "deelzat/v2-ui";
import {Colors} from "deelzat/style";
import ProfileTabConst from 'v2modules/shop/constants/profile-tab.const';

const TAB_BUTTON_HEIGHT = 45;

const ProfileTabs = (props) => {
    const {
        tabs = [],
        tintColor = Colors.MAIN_COLOR,
        currentTab,
        onPressTab = (selectedTab) => {},
    } = props;

    const [TABS_OPTIONS] = useState(getProfileTabOptions());

    return (
        <View style={[style.container, {height: TAB_BUTTON_HEIGHT}]}>
            {
                tabs.map((tab, index) => {
                    const focused = currentTab === tab;
                    const option = TABS_OPTIONS[tab];

                    return (
                        <Touchable
                            activeOpacity={1}
                            key={"_" + index}
                            onPress={() => onPressTab(tab)}
                            style={[
                                style.tabView,
                                index === 0 && {borderTopStartRadius: 24},
                                index === tabs.length - 1 && {borderTopEndRadius: 24}
                            ]}>
                            <DzText style={[style.tabLabel, focused && {...style.tabLabelFocused, color: tintColor}]}>
                                {option?.label}
                            </DzText>
                            {
                                (!tabs.find(t => t === ProfileTabConst.LOADER)) &&
                                <View style={[style.tabStripe, focused && {backgroundColor: tintColor}]}/>
                            }
                        </Touchable>
                    )
                })
            }
        </View>
    );
};

export default ProfileTabs;
