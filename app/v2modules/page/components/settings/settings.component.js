import React, {useCallback, useMemo, useState} from 'react';
import ReactNative, {View, Text, ScrollView, I18nManager, Platform} from 'react-native';

import { settingsStyle as style } from './settings.component.style';
import {DzText, Panel, TextParser, Touchable} from "deelzat/v2-ui";
import I19n, {getLocale, isRTL} from "dz-I19n";
import AtSignIcon from "assets/icons/AtSign.svg";
import InfoIcon from "assets/icons/Info.svg";
import LangIcon from "assets/icons/Globe.svg";
import LockIcon from "assets/icons/Lock.svg";
import BlockedIcon from "assets/icons/Blocked.svg";
import LocationIcon from "assets/icons/Location.svg";
import PanelHandle from "assets/icons/PanelHandle.svg";
import {useDispatch, useSelector} from "react-redux";
import {CommonActions } from '@react-navigation/native';
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import AlgoliaIndicesConst from "modules/main/constants/algolia-indices.const";
import {Colors, LayoutStyle, LocalizedLayout} from "deelzat/style";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import AppVersion from "modules/main/components/app-version/app-version.component";
import RNRestart from "react-native-restart";
import {setUserProperty, trackChangeLanguage, trackChangeMarket} from "modules/analytics/others/analytics.utils";
import {saveLanguageLocale} from "dz-I19n/locales.storage";
import {Space} from "deelzat/ui";
import GlobalSpinnerService from "modules/main/components/global-spinner/global-spinner.service";
import {useNavigation} from "@react-navigation/native";
import {isEmptyValues} from "modules/main/others/main-utils";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";
import * as Actions from "v2modules/geo/stores/geo/geo.actions";
import {saveBrowseCountryCode} from "v2modules/geo/others/geo.localstore";
import USER_PROP from "modules/analytics/constants/analytics-user-propery.const";
import WelcomeMarketService from "v2modules/geo/components/welcome-market/welcome-market.component.service";
import {setDisplaySplashOnStart} from "modules/main/others/app.localstore";
import MainTabsNavsConst from "v2modules/main/constants/main-tabs-navs.const";
import RootService from "v2modules/root/components/root/root.service";
import AppInfoSectionsConst from 'v2modules/page/constants/app-info-sections.const';
import ProductApi from 'v2modules/product/apis/product.api';
import FastImage from '@deelzat/react-native-fast-image';
const {RestartAppModule} = ReactNative.NativeModules;


const SectionHeader = (props) => {
    const  {
        title = '',
        icon = <></>
    } = props;

    return (
        <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
            {icon}
            <View style={{width: 10}}/>
            <DzText style={style.headerTitle}>
                {title}
            </DzText>
        </View>
    )
}


const Settings = (props) => {
    const {
        showLanguageSeparately = false
    } = props;

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const marketList = useSelector(persistentDataSelectors.shippableCountriesSelector);
    const selectedMarket = useSelector(geoSelectors.geoBrowseCountryCodeSelector);
    const sections = useSelector(persistentDataSelectors.staticContentSelector);
    const [isContactUsExpanded, isContactUsExpandedSet] = useState(false);
    const [isLocationExpanded, isLocationExpandedSet] = useState(false);
    const [isLanguageExpanded, isLanguageExpandedSet] = useState(false);
    // todo GEO_TEMP useState(!!ANALYTICS_PREFIX);
    const [enableMultiMarkets] = useState(false);

    const ExpandableHandle = () => {
        return (
            <PanelHandle stroke={Colors.MAIN_COLOR}
                         strokeWidth={1.5}
                         width={16}
                         height={16}/>
        )
    }


    const onPressFAQs = () => {
        const faq = {
            section: AppInfoSectionsConst.FAQ,
            requestFomIndex: AlgoliaIndicesConst.FAQS,
        };
        navigation.push(MainStackNavsConst.INFO, {data: faq, title: I19n.t('الأسئلة الأكثر شيوعاً')});
    }

    const restart = () => {
        RestartAppModule.restartApp();
    }

    const onPressChangeToAR = () => {
        trackChangeLanguage('ar');
        GlobalSpinnerService.setVisible(true);
        ProductApi.clearCache();
        FastImage.clearMemoryCache();
        (async () => {
            await saveLanguageLocale('ar');
            I18nManager.allowRTL(true);
            I18nManager.forceRTL(true);
            if (Platform.OS === 'android') {
                restart();
            } else {
                await setDisplaySplashOnStart(true);
                setTimeout(RNRestart.Restart, 100);
            }
            setTimeout(restart, 100);
        })();
    }


    const onPressChangeToEN = () => {
        trackChangeLanguage('en');
        GlobalSpinnerService.setVisible(true);
        ProductApi.clearCache();
        FastImage.clearMemoryCache();
        (async () => {
            await saveLanguageLocale('en');
            I18nManager.allowRTL(false);
            I18nManager.forceRTL(false);
            if (Platform.OS === 'android') {
                restart();
            } else {
                await setDisplaySplashOnStart(true);
                setTimeout(RNRestart.Restart, 100);
            }
            setTimeout(restart, 100);
        })();
    }


    const onPressPolicy = () => {
        navigation.push(MainStackNavsConst.INFO, {
            data: sections[AppInfoSectionsConst.PRIVACY_POLICY],
            title: I19n.t('سياسة ديلزات')
        });
    }

    const onPressTerms = () => {
        navigation.push(MainStackNavsConst.INFO, {
            data: sections[AppInfoSectionsConst.TERMS_AND_CONDITIONS],
            title: I19n.t('الشروط والبنود')
        });
    }

    const onPressBlockedShops = () => {
        navigation.push(MainStackNavsConst.BLOCKED_USERS);
    }


    const getCurrencyFromCode = (code) => {
        return marketList.find(c => c.code === code)?.currency;
    }

    const onChangeMarket = (market) => {
        WelcomeMarketService.showWelcomeMarket(market);

        setTimeout(() => {
            const {code} = market;
            dispatch(Actions.SetBrowseCountryCode(code));
            dispatch(Actions.SetCurrencyCode(getCurrencyFromCode(code)));

            saveBrowseCountryCode(code)
                .catch(console.warn);

            trackChangeMarket(code);
            setUserProperty(USER_PROP.BROWSE_CODE, code);

            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        {name: MainTabsNavsConst.BROWSE},
                    ],
                }));

            navigation.navigate(MainTabsNavsConst.BROWSE)


        }, 500);
    }


    const ContactUsHeader = useMemo(() => {
     return (
         <SectionHeader title={I19n.t('تواصل معنا')} icon={<AtSignIcon/>}/>
     )
    }, []);

    if (isEmptyValues(sections)) {
        return <></>
    }

    return (
        <View>
            {
                (showLanguageSeparately) &&
                <View style={[style.separateLanguageView, {width: LocalizedLayout.value(72, 85)}]}>
                    <Panel header={<DzText style={[style.separateLanguageSelected, {[isRTL()? 'paddingEnd': 'paddingStart']: -10}]}>{isRTL()? 'العربية': 'English'}</DzText>}
                           isExpanded={isLanguageExpanded}
                           initialHeight={25}
                           onExpandCollapse={() => isLanguageExpandedSet(_old => !_old)}
                           CustomHandle={ExpandableHandle}>
                        <Space directions={'h'} size={'md'}/>
                        <Touchable onPress={isRTL()? onPressChangeToEN: onPressChangeToAR}>
                            <DzText style={[style.separateLanguageSelected, {color: Colors.N_BLACK}]}>
                                {!isRTL()? 'العربية': 'English'}
                            </DzText>
                            <Space directions={'h'} size={'md'}/>
                        </Touchable>
                    </Panel>
                    <Space directions={'h'} size={'md'}/>
                </View>

            }
            <View style={style.section}>
                <Panel header={ContactUsHeader}
                       initialHeight={25}
                       onExpandCollapse={() => isContactUsExpandedSet(_old => !_old)}
                       CustomHandle={ExpandableHandle}
                       isExpanded={isContactUsExpanded}>
                    <TextParser content={sections[AppInfoSectionsConst.CONTACT_US][getLocale()].body}
                                textStyle={[style.sectionText, LocalizedLayout.TextAlign(isRTL()), {paddingEnd: isRTL()? 24: 0}]}/>
                </Panel>
            </View>
            <Space directions={'h'}/>
            <Space directions={'h'} size={'md'}/>
            <View style={style.section}>
                <Panel header={<SectionHeader title={I19n.t('الأسئلة الأكثر شيوعاً')} icon={<InfoIcon/>}/>}
                       sideWayHandle={true}
                       onExpandCollapse={onPressFAQs}
                       CustomHandle={ExpandableHandle}/>
            </View>
            {
                (enableMultiMarkets) &&
                    <>
                        <Space directions={'h'}/>
                        <Space directions={'h'} size={'md'}/>
                        <View style={style.section}>
                            <Panel header={<SectionHeader title={I19n.t('الدولة')} icon={<LocationIcon/>}/>}
                                   onExpandCollapse={() => isLocationExpandedSet(_old => !_old)}
                                   CustomHandle={ExpandableHandle}
                                   initialHeight={25}
                                   isExpanded={isLocationExpanded}>
                                <View>
                                    <Space directions={'h'}/>
                                    <Space directions={'h'} size={'md'}/>
                                    {
                                        marketList.map(market => (
                                            <View key={market.objectID}>
                                                <Space directions={'h'} size={'md'}/>
                                                <Touchable onPress={() => onChangeMarket(market)}>
                                                    <DzText style={[
                                                        style.languageOption,
                                                        (selectedMarket === market.code) && style.languageOptionSelected
                                                    ]}>
                                                        {market[getLocale()]}
                                                    </DzText>
                                                </Touchable>
                                                <Space directions={'h'}/>
                                            </View>
                                        ))
                                    }
                                    <Space directions={'h'} size={'md'}/>
                                </View>
                            </Panel>
                        </View>
                    </>
            }
            {
                (!showLanguageSeparately) &&
                    <>
                        <Space directions={'h'}/>
                        <Space directions={'h'} size={'md'}/>
                        <View style={style.section}>
                            <Panel header={<SectionHeader title={I19n.t('اللغة')} icon={<LangIcon/>}/>}
                                   onExpandCollapse={() => isLanguageExpandedSet(_old => !_old)}
                                   CustomHandle={ExpandableHandle}
                                   initialHeight={25}
                                   isExpanded={isLanguageExpanded}>
                                <Space directions={'h'} size={'md'}/>
                                <Space directions={'h'} size={'md'}/>
                                <Touchable onPress={onPressChangeToAR}>
                                    <DzText style={[style.languageOption, isRTL() && style.languageOptionSelected]}>
                                        العربية
                                    </DzText>
                                </Touchable>
                                <Space directions={'h'}/>
                                <Space directions={'h'} size={'md'}/>
                                <Touchable onPress={onPressChangeToEN}>
                                    <DzText style={[style.languageOption, !isRTL() && style.languageOptionSelected]}>
                                        English
                                    </DzText>
                                </Touchable>
                                <Space directions={'h'} size={'md'}/>
                            </Panel>
                        </View>
                    </>
            }
            <Space directions={'h'}/>
            <Space directions={'h'} size={'md'}/>
            <View style={style.section}>
                <Panel header={<SectionHeader title={I19n.t('سياسة ديلزات')} icon={<LockIcon/>}/>}
                       onExpandCollapse={onPressPolicy}
                       CustomHandle={ExpandableHandle}
                       sideWayHandle={true}/>
            </View>
            <Space directions={'h'}/>
            <Space directions={'h'} size={'md'}/>
            <View style={style.section}>
                <Panel header={<SectionHeader title={I19n.t('الشروط والبنود')} icon={<LockIcon/>}/>}
                       onExpandCollapse={onPressTerms}
                       CustomHandle={ExpandableHandle}
                       sideWayHandle={true}/>
            </View>
            <Space directions={'h'}/>
            <Space directions={'h'} size={'md'}/>
            <View style={style.section}>
                <Panel header={<SectionHeader title={I19n.t('الحسابات المحجوبة')} icon={<BlockedIcon/>}/>}
                       onExpandCollapse={onPressBlockedShops}
                       CustomHandle={ExpandableHandle}
                       sideWayHandle={true}/>
            </View>
            <Space directions={'h'} size={'md'}/>
            <AppVersion/>
            <Space directions={'h'} size={'md'}/>
        </View>
    );
};

export default Settings;
