import React, {useCallback, useEffect, useRef, useState} from 'react';
import { View, SafeAreaView, Platform, Dimensions, Animated, Easing, Image } from 'react-native';

import { onBoardingContainerStyle as style } from './onboarding.container.style';
import Carousel from "react-native-snap-carousel";
import LogoHeader from "assets/icons/DeelzatLogoColored.svg";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import I19n, {getLocale, isRTL} from "dz-I19n";
import { DzText, Touchable } from 'deelzat/v2-ui';
import {Spacing} from "deelzat/style";
import {
    trackOnBoardingComplete,
    trackOnBoardingSkip,
    trackOnBoardingStart
} from "modules/analytics/others/analytics.utils";
import {setOnBoardingHasCompleted} from "modules/main/others/app.localstore";
import {geoActions} from "v2modules/geo/stores/geo/geo.store";
import {useDispatch} from "react-redux";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PAGE_WIDTH = Dimensions.get('window').width;

const OnBoardingContainer = (props) => {

    const {
        pages = [],
    } = props.route.params;

    const dispatch = useDispatch();
    const SHOULD_REVERSE = Platform.OS === 'android' && isRTL();
    const carouselRef = useRef(null);
    const [currentPage, currentPageSet] = useState(SHOULD_REVERSE? pages.length - 1: 0);
    const [displayPages, displayPagesSet] = useState([]);
    const dotsAnim = useRef(pages.map(() => new Animated.Value(0)));

    useEffect(() => {
        trackOnBoardingStart();
        setOnBoardingHasCompleted();
    }, []);


    useEffect(() => {
        if (pages.length) {
            displayPagesSet(SHOULD_REVERSE? pages.reverse() : pages);
        }
    }, [pages]);


    const exitOnBoarding = () => {
        RootNavigation.goBack();
    }

    const onPressSkip = () => {
        trackOnBoardingSkip(currentPage);
        exitOnBoarding();
    }

    const onPressButton = () => {
        if ((SHOULD_REVERSE && currentPage === 0) || (!SHOULD_REVERSE && currentPage === pages.length - 1)) {
            trackOnBoardingComplete();
            exitOnBoarding();
        }
        else {
            carouselRef.current?.snapToItem(SHOULD_REVERSE? currentPage - 1: currentPage + 1);
        }
    }


    useEffect(() => {
        trackOnBoardingStart();
        setOnBoardingHasCompleted();

        return () => {
            dispatch(geoActions.SetAllowToShowSwitchMarket(true));
        }
    }, []);


    useEffect(() => {
        Animated.parallel(
            dotsAnim.current.map((anim, index) => {
                    const selectedFlex = 0.45;
                    const unselectedFlex = 0.30 / (pages.length - 1);
                    const toValue = currentPage === index ? selectedFlex : unselectedFlex;
                    return Animated.timing(anim, {toValue: toValue, duration: 250, useNativeDriver: false})
                }
            )).start();
    }, [currentPage]);

    const renderItem = useCallback(({item, index}) => {
        return (
            <View style={style.svg}>
                {
                    (item.png) &&
                    <Image style={style.imageStyle}
                           resizeMode={'stretch'}
                           source={{ uri: item.png }} />
                }
            </View>
        )
    }, []);

    const onSnapToItem = useCallback((index) => {
        currentPageSet(index);
    }, []);


    const renderDots = displayPages.map((_, index) => {
        const spaceWidth = 0.25 / (displayPages.length - 1);
        return (
            <>
                {
                    (index !== 0) &&
                    <View key={`space_${index}`} style={{flex: spaceWidth}}/>
                }
                <Animated.View key={`dot_${index}`} style={[style.dotView, {flex: dotsAnim.current[index]}]}/>
            </>
        )
    });


    return (
        <SafeAreaView style={style.container}>
            <Space directions={'h'} size={'md'}/>
            <View style={style.header}>
                <LogoHeader height={40} width={110}/>
                <Touchable style={style.skipBtn}
                           onPress={onPressSkip}
                           hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                    <DzText style={style.skip}>
                        {I19n.t('تخطي')}
                    </DzText>
                </Touchable>
            </View>
            <Space directions={'h'} size={'md'}/>
            <Space directions={'h'} size={'sm'}/>
            <Animated.View style={{height: PAGE_WIDTH * 1.2}}>
                {
                    (displayPages.length > 0) &&
                    <Carousel
                        ref={carouselRef}
                        data={displayPages}
                        useScrollView={true}
                        firstItem={SHOULD_REVERSE? displayPages.length - 1: 0}
                        bounces={false}
                        initialScrollIndex={0}
                        renderItem={renderItem}
                        sliderWidth={PAGE_WIDTH}
                        itemWidth={PAGE_WIDTH}
                        itemHeight={PAGE_WIDTH}
                        enableSnap={true}
                        onBeforeSnapToItem={onSnapToItem}
                        inactiveSlideScale={1}
                        enableMomentum={true}
                        scrollEndDragDebounceValue={100}
                        decelerationRate={0.9}
                    />
                }

            </Animated.View>
            {
                (displayPages.length > 0) &&
                <View style={style.buttonWithDotsContainer}>
                    <View style={[
                        style.dotsView,
                        SHOULD_REVERSE && {scaleX: -1},
                        {marginBottom: SCREEN_HEIGHT * 0.15}
                    ]}>
                        {renderDots}
                    </View>
                    <View style={Spacing.HorizontalPadding}>
                        <Button
                            onPress={onPressButton}
                            size={ButtonOptions.Size.LG}
                            type={ButtonOptions.Type.PRIMARY}
                            text={displayPages[currentPage].texts[getLocale()]}/>
                    </View>
                    <Space directions={'h'} size={'lg'}/>
                </View>
            }
        </SafeAreaView>
    )
}

export default OnBoardingContainer
