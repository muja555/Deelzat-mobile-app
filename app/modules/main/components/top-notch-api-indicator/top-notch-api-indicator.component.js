import React from 'react';
import { View } from 'react-native';

import { topNotchApiIndicatorStyle as style } from './top-notch-api-indicator.component.style';
import {useSelector} from "react-redux";
import {appSelectors} from "modules/main/stores/app/app.store";

const TopNotchApiIndicator = () => {

    const isStagingApi = useSelector(appSelectors.isStagingAPISelector)

    if (!isStagingApi) {
        return <></>
    }

    return (
        <View style={[style.container, isStagingApi && {backgroundColor: 'red'}]}>

        </View>
    );
};

export default TopNotchApiIndicator;
