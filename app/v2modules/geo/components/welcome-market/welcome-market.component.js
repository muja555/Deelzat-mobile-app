import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, Animated, ActivityIndicator} from 'react-native';

import { welcomeMarketStyle as style } from './welcome-market.component.style';
import WelcomeMarketService from "./welcome-market.component.service";
import {getLocale} from "dz-I19n";
import {Colors} from "deelzat/style";
import FastImage from "@deelzat/react-native-fast-image"

const WelcomeMarket = () => {

    const [selectedMarket, selectedMarketSet] = useState();
    const fullMarketAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        return WelcomeMarketService.onShowWelcomeMarket((market = {}) => {
            selectedMarketSet(market);
        });
    }, []);

    useEffect(() => {
        if (selectedMarket) {
            Animated.timing(fullMarketAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();

            setTimeout(() => {
                Animated.timing(fullMarketAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true
                }).start();
            }, 3000);

            setTimeout(() => {
                selectedMarketSet();
            }, 3000);
        }
    }, [selectedMarket]);

    if (!selectedMarket) {
        return <></>
    }

    return (
        <View style={style.container}
              pointerEvents={'none'}>
            <ActivityIndicator size="large" color={Colors.MAIN_COLOR} />
            <Animated.View style={{width: '103%', height: '100%', opacity: fullMarketAnim, padding: 0, position: 'absolute'}}>
                <FastImage style={style.bigImage}
                           resizeMode='cover'
                           resizeMethod="resize"
                           source={{uri: selectedMarket?.market_image[getLocale()]}}/>
            </Animated.View>
        </View>
    );
};

export default WelcomeMarket;
