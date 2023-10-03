import React, {useEffect, useRef, useState} from 'react';
import {networkStatusStyle as style} from "./network-status.component.style";
import {useNetInfo} from "@react-native-community/netinfo";
import {Animated} from "react-native";
import {DzText} from "deelzat/v2-ui";
import {getNetworkOptions} from "./network-status.component.utils";
import NetworkStateConst from "./network-state.component.const";
import {useSelector} from "react-redux";
import {appSelectors} from "modules/main/stores/app/app.store";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const BANNER_HEIGHT = 18;

const NetworkStatus = () => {

    const options = getNetworkOptions();
    const insets = useSafeAreaInsets();

    const netInfo = useNetInfo();
    const [hideView, hideViewSet] = useState(true);
    const appInitialized = useSelector(appSelectors.appInitializedSelector);
    const [networkState, networkStateSet] = useState(NetworkStateConst.CONNECTED);
    const bannerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (appInitialized) {
            setTimeout(hideViewSet, 1500);
        }
    }, [appInitialized]);

    const setState = (state) => {
        let _networkState = NetworkStateConst.DISCONNECTED;
        if (state.isConnected && state.isInternetReachable) {
            _networkState = NetworkStateConst.CONNECTED;
        }
        else if (state.isConnected) {
            _networkState = NetworkStateConst.POOR;
        }

        if (_networkState !== networkState) {
            networkStateSet(_networkState);
        }
    }

    useEffect(() => {
        if (appInitialized) {
            setState(netInfo);
        }
    }, [appInitialized, netInfo]);


    useEffect(() => {
        if (networkState === NetworkStateConst.CONNECTED) {
            setTimeout(() => {
                Animated.timing(
                    bannerAnim, {toValue: 0, duration: 250, useNativeDriver: false,}
                ).start(() => hideViewSet(true));
            }, 2000);
        }
        else {
            hideViewSet(false);
            Animated.timing(
                bannerAnim, {toValue: 1, duration: 250, useNativeDriver: false,}
            ).start();
        }
    }, [networkState]);


    const translateY = bannerAnim?.interpolate({
        inputRange: [0, 1],
        outputRange: [-BANNER_HEIGHT - insets.top, 0],
        extrapolate: 'clamp',
    });

    if (hideView) {
        return <></>
    }

    return (
        <Animated.View style={[
            style.banner, {
                height: BANNER_HEIGHT + insets.top,
                backgroundColor: options[networkState].color,
                marginTop: translateY,
                paddingTop: insets.top / 1.5
            }]}>
            <DzText style={style.bannerText}>
                {options[networkState].label}
            </DzText>
        </Animated.View>
    );
};

export default NetworkStatus;
