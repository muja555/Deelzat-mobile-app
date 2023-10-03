import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import { profileLoaderStyle as style } from './profile-loader.component.style';
import {Colors} from "deelzat/style";

const ProfileLoader = (props) => {
    const {
        profileParams = {headerHeight: 0},
    } = props;

    return (
        <View style={[style.container, {paddingTop: profileParams.headerHeight}]}>
            <ActivityIndicator size="large" color={profileParams?.theme?.color1 || Colors.MAIN_COLOR} />
        </View>
    )
};

export default ProfileLoader;
