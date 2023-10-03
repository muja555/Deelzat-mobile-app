import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import LottieView from "lottie-react-native";

import { bigSplashOverlayStyle as style } from './big-splash-overlay.component.style';
import BigSplashOverlayService from "./big-splash-overlay.service";
import {setDisplaySplashOnStart, shouldDisplaySplashOnStart} from "modules/main/others/app.localstore";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

let SplashAnimation;
const BigSplashOverlay = () => {

    const [isVisible, isVisibleSet] = useState(false);

    if (!SplashAnimation) {
        SplashAnimation = require('android/app/src/main/res/raw/logo_vid.json');
    }

    useEffect(() => {

        (async () => {
            const shouldDisplay = await shouldDisplaySplashOnStart();
            isVisibleSet(shouldDisplay);

            if (shouldDisplay) {
                setTimeout(() => {
                    isVisibleSet(false);
                }, 4000);
            }

            setDisplaySplashOnStart(false);
        })();

        return BigSplashOverlayService.onChangeVisibility((show) => {
            isVisibleSet(show);
        })
    }, []);


    if (!isVisible) {
        return <></>;
    }

    return (
        <View style={style.container} pointerEvents={'none'}>
            <LottieView source={SplashAnimation}
                        resizeMode={'cover'}
                        autoPlay={true}
                        speed={1}
                        style={{width: SCREEN_WIDTH,  height: SCREEN_HEIGHT / 2}}
                        loop={false} />
        </View>
    );
};

export default BigSplashOverlay;
