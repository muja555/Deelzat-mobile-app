import React, {useEffect, useState} from 'react'
import {View} from 'react-native'
import {globalSpinnerStyle as style} from './global-spinner.components.style'
import GlobalSpinnerService from "./global-spinner.service";
import Spinner from "react-native-loading-spinner-overlay";
import {Colors} from "deelzat/style";

const GlobalSpinner = () => {

    const [isVisible, isVisibleSet] = useState(false)

    useEffect(() => {

        const onSetVisibleOff = GlobalSpinnerService.onSetVisible((isVisible) => {
            isVisibleSet(isVisible);
        });

        return () => {
            onSetVisibleOff();
        }
    }, []);

    if (!isVisible)
        return <></>

    return(
        <View style={style.container}>
            <Spinner visible={isVisible}
                     animation={'fade'}
                     textContent={''}
                     overlayColor={'white'} color={Colors.CERULEAN_BLUE} />
        </View>
    )
}

export default GlobalSpinner
