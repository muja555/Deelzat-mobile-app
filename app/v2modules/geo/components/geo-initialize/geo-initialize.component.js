import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, Animated, Platform} from 'react-native';

import { geoInitializeStyle as style } from './geo-initialize.component.style';
import useMidViewModal from "v2modules/shared/modals/mid-view/mid-view.modal";
import {useDispatch, useSelector} from "react-redux";
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import {LayoutStyle} from "deelzat/style";
import {DzText, Touchable} from "deelzat/v2-ui";
import I19n, {getLocale, isRTL} from "dz-I19n";
import {Space} from "deelzat/ui";
import GeoLocationApi from "v2modules/geo/apis/geo-location.api";
import * as Actions from 'v2modules/geo/stores/geo/geo.actions';
import {
    getBrowseCountryCode,
    getGeoCountryCode,
    saveBrowseCountryCode,
    saveGeoCountryCode
} from "v2modules/geo/others/geo.localstore";
import {geoActions, geoSelectors} from "v2modules/geo/stores/geo/geo.store";
import {setUserProperty, trackChangeMarket} from "modules/analytics/others/analytics.utils";
import USER_PROP from "modules/analytics/constants/analytics-user-propery.const";
import WelcomeMarketService from "../welcome-market/welcome-market.component.service";

const SelectMarketModal = useMidViewModal();
const GeoInitialize = () => {

    const marketList = useSelector(persistentDataSelectors.shippableCountriesSelector);
    const allowToShowSwitchMarket = useSelector(geoSelectors.allowToShowSwitchMarketSelector)
    const dispatch = useDispatch();

    const [shouldShowSelectMarket, shouldShowSelectMarketSet] = useState(false);

    const tabsOpacityAnim = useRef(new Animated.Value(0)).current;


    const prefetchMarketImages = () => {
        marketList.forEach((market) => {
            Image.prefetch(market?.market_image[getLocale()]);
        })
    }


    const getCurrencyFromCode = (code) => {
        return marketList.find(c => c.code === code)?.currency;
    }


    useEffect(() => {
        const timeout = setTimeout(() => {
            if (shouldShowSelectMarket && allowToShowSwitchMarket) {
                SelectMarketModal.show(true);
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [shouldShowSelectMarket, allowToShowSwitchMarket]);


    useEffect(() => {
        if (!marketList.length) {
            return
        }

        (async () => {

            const savedGeoCountryCode = await getGeoCountryCode();
            const savedBrowseCountryCode = await getBrowseCountryCode() || savedGeoCountryCode;

            try {

                let {country} = await GeoLocationApi.getGeoLocation();
                country = country === 'IL'? 'PS': country;

                let toSaveBrowseCode = savedBrowseCountryCode || country;
                toSaveBrowseCode = toSaveBrowseCode === 'IL'? 'PS': toSaveBrowseCode;

                // todo GEO_TEMP
                country = 'PS';
                toSaveBrowseCode = 'PS';

                if (!!toSaveBrowseCode && !marketList.find(({code}) => code === toSaveBrowseCode)) {
                    toSaveBrowseCode = 'PS';
                    // todo GEO_TEMP
                    // shouldShowSelectMarketSet(true);
                    // prefetchMarketImages();
                }

                dispatch(Actions.SetBrowseCountryCode(toSaveBrowseCode));
                dispatch(Actions.SetGeoCountryCode(country));
                dispatch(Actions.SetCurrencyCode(getCurrencyFromCode(toSaveBrowseCode)));

                saveBrowseCountryCode(toSaveBrowseCode)
                    .catch(console.warn);
                saveGeoCountryCode(country)
                    .catch(console.warn);

                setUserProperty(USER_PROP.BROWSE_CODE, toSaveBrowseCode);
                setUserProperty(USER_PROP.GEO_CODE, country);

            } catch (e) {

                dispatch(Actions.SetGeoCountryCode(savedGeoCountryCode || 'PS'));
                dispatch(Actions.SetBrowseCountryCode(savedBrowseCountryCode || 'PS'));
                dispatch(Actions.SetCurrencyCode(getCurrencyFromCode(savedBrowseCountryCode || 'PS')))

                console.warn(e);
            }
        })();
    }, [marketList]);


    const onSelect = (market) => {

        SelectMarketModal.show(false);
        WelcomeMarketService.showWelcomeMarket(market);

        const {code} = market;

        dispatch(Actions.SetBrowseCountryCode(code));
        dispatch(Actions.SetCurrencyCode(getCurrencyFromCode(code)));

        saveBrowseCountryCode(code)
            .catch(console.warn);

        trackChangeMarket(code);
        setUserProperty(USER_PROP.BROWSE_CODE, code);

        dispatch(geoActions.SetAllowToShowSwitchMarket(false));
    }


    return (
        <SelectMarketModal.Modal
            enableOnBackDrop={false}>
            <View style={style.container}>
                <Image source={require('assets/icons/BackgroundMap.png')}
                       style={style.backgroundImage}/>
                <View style={style.content}>
                    <View style={LayoutStyle.AlignItemsCenter}>
                        <DzText style={style.title}>
                            <DzText style={style.titleOrange}>
                                {I19n.t('أفرح') + ' '}
                            </DzText>
                            <DzText style={style.title}>
                                {I19n.t('أحبائك في الوطن ب') + ' '}
                            </DzText>
                            <DzText style={style.titleMain}>
                                {I19n.t('هدية')}
                            </DzText>
                        </DzText>
                    </View>
                    <View style={{height: 11}}/>
                    <View style={LayoutStyle.AlignItemsCenter}>
                        <DzText style={style.subTitle}>
                            {I19n.t('لسا بتستنى!')}
                        </DzText>
                        <DzText style={[style.subTitle, !isRTL() && {letterSpacing: 3}]}>
                            {I19n.t('إبدأ بالتسوق')}
                        </DzText>
                    </View>
                    <View style={{height: 35}}/>
                    <View style={style.flagsView}>
                        {
                            marketList.map(country => (
                                <Touchable onPress={() => onSelect(country)}
                                           key={country.objectID}
                                           style={LayoutStyle.AlignItemsCenter}>
                                    <Image style={style.flag} source={{uri: country.flag}}/>
                                    <Space directions={'h'} size={'sm'}/>
                                    <DzText style={style.flagTitle}>
                                        {country[getLocale()]}
                                    </DzText>
                                    <Space directions={'h'} size={'lg'}/>
                                </Touchable>
                            ))
                        }
                    </View>
                    <View style={LayoutStyle.Flex}/>
                </View>
            </View>
        </SelectMarketModal.Modal>
    );
};

export default GeoInitialize;
