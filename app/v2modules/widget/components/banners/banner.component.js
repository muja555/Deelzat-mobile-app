import React, { useCallback, useEffect, useRef, useState} from 'react';
import {View, I18nManager, Platform, Image} from 'react-native';

import { bannerStyle as style } from './banner.component.style';
import GroupsInput from "v2modules/widget/inputs/groups.input";
import GroupsApi from "v2modules/widget/apis/groups.api";
import WidgetCategoriesConst from "v2modules/widget/constants/widget-categories.const";
import Carousel, {Pagination} from "react-native-snap-carousel";
import BannerItem from "v2modules/widget/components/banners-item/banner-item.component";
import {Colors} from "deelzat/style";
import {useSelector} from "react-redux";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import {routeTo} from "modules/root/components/deeplinks-router/deeplinks-router.utils";
import {trackClickOnBanner} from "modules/analytics/others/analytics.utils";
import Gradient from "assets/icons/Gradient2.png";

const Banner = (props) => {

    const {
        componentFilter,
        height = 0,
        width = 0,
    } = props;

    const browseCountryCode = useSelector(geoSelectors.geoBrowseCountryCodeSelector);
    const carouselRef = useRef(null);
    const [activeSlide, activeSlideSet] = useState(0);

    const [banners, bannersSet] = useState([]);

    useEffect(() => {

        if (!browseCountryCode) {
            return;
        }

        const input = new GroupsInput();
        input.countryCode = browseCountryCode;
        input.componentFilter = componentFilter;
        input.category = WidgetCategoriesConst.BANNERS;
        GroupsApi.getItems(input)
            .then(res => bannersSet(res))
            .catch(console.warn);

    }, [browseCountryCode]);

    const renderItem = useCallback(({item, index}) => {

        const imageStyle = {width, height};

        const onPressBanner = () => {
            const trackSource = {name: EVENT_SOURCE.BANNER, attr1: item.objectID, attr2: componentFilter};
            const type = item.actionType;
            const id = item.filters;
            routeTo(type, id, trackSource);
            trackClickOnBanner(item, index, componentFilter);
        };

        return (
            <BannerItem
                item={item}
                index={index}
                imageStyle={imageStyle}
                onPress={onPressBanner}/>
        )
    }, [banners]);

    const InactiveDot = useCallback(({active, index}) => (
        <View style={style.inactiveDotStyleContainer}>
            <View style={[
                style.dotStyle,
                (index === activeSlide) && style.activeDot,
                (index === activeSlide) && {backgroundColor: banners[index].dotColor ?? Colors.MAIN_COLOR}
            ]}/>
        </View>
    ), [activeSlide, banners]);


    const onSnapToItem = useCallback((index) => {
        activeSlideSet((I18nManager.isRTL && Platform.OS !== 'ios')? (banners.length - index - 1) : index);
    }, [banners]);

    const initialIndex = (I18nManager.isRTL && Platform.OS !== 'ios')? banners.length -1 : 0;

    if (banners.length === 0) {
        return <></>
    }

    return (
        <View>
            <View style={[style.container, {height: height}]}>
                <Carousel
                    ref={carouselRef}
                    data={banners}
                    useScrollView={true}
                    firstItem={initialIndex}
                    bounces={true}
                    initialScrollIndex={initialIndex}
                    renderItem={renderItem}
                    sliderWidth={width}
                    itemWidth={width}
                    itemHeight={height}
                    inactiveSlideScale={1}
                    enableSnap={true}
                    onBeforeSnapToItem={onSnapToItem}
                    swipeThreshold={20}
                    shouldOptimizeUpdates={true}
                    scrollEndDragDebounceValue={100}
                    enableMomentum={true}
                    decelerationRate={0.9}
                />
                <View
                    style={[style.paginationDots, I18nManager.isRTL && Platform.OS !== 'ios' && style.paginationDotsRTL]}>
                    <Pagination
                        dotsLength={banners.length}
                        activeDotIndex={activeSlide}
                        carouselRef={carouselRef}
                        inactiveDotElement={<InactiveDot/>}
                        dotElement={<InactiveDot/>}
                        inactiveDotScale={1}
                        tappableDots={false}
                    />
                </View>
            </View>
            <Image source={Gradient} resizeMethod={'scale'} style={style.gradientView}/>
        </View>
    );
}

export default Banner;
