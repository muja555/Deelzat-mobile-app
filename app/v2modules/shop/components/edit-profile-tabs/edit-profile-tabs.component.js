import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';

import { editProfileTabsStyle as style } from './edit-profile-tabs.component.style';
import { DzText, Touchable } from 'deelzat/v2-ui';
import { Colors, LayoutStyle } from 'deelzat/style';
import { getEditProfileTabsOptions } from 'v2modules/shop/containers/edit-profile/edit-profile.container.utils';
import CornerIcon from 'assets/icons/RoundCorner.svg';

const EditProfileTabs = (props) => {

    const {
        tabs = [],
        selectedTheme,
        currentTab,
        onPressTab = (selectedTab) => {},
    } = props;

    const [TABS_OPTIONS] = useState(getEditProfileTabsOptions());
    const currentIndex = tabs.findIndex(t => t === currentTab);

    return (
        <View style={style.container}>
            {
                tabs.map((tab, index) => {
                    const focused = currentTab === tab;
                    const option = TABS_OPTIONS[tab];

                    return (
                        <Touchable
                            activeOpacity={1}
                            onPress={() => onPressTab(tab)}
                            key={index}
                            style={[style.tabBtn,
                                focused && style.tabBtnFocused,
                                focused && {backgroundColor: Colors.N_GREY_4},
                                {flex: 1/ tabs.length}]}>
                            <DzText style={[
                                style.tabBtnText,
                                focused && style.tabBtnTextFocused,
                                focused && selectedTheme && {color: selectedTheme?.color1},
                                option?.labelStyle]}>
                                {option?.label}
                            </DzText>
                            {
                                (!focused && currentIndex - index === 1) &&
                                <View style={style.endBottomCorner}>
                                    <CornerIcon width={29}
                                                height={28} />
                                </View>
                            }
                            {
                                (!focused && currentIndex - index === -1) &&
                                <View style={style.startBottomCorner}>
                                    <CornerIcon width={29}
                                                height={28} />
                                </View>
                            }
                        </Touchable>
                    )
                })
            }
        </View>
    );
};

export default EditProfileTabs;
