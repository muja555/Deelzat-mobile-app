import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Animated, ActivityIndicator, Dimensions, Platform } from 'react-native';

import { productImagesCarouselStyle as style } from './product-images-carousel.component.style';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import Carousel, {Pagination} from "react-native-snap-carousel";
import {ImageWithBlur, Touchable} from "deelzat/v2-ui";
import {Space} from "deelzat/ui";
import {refactorImageUrl} from "modules/main/others/main-utils";
import {Colors} from "deelzat/style";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import {
    CAROUSEL_HEIGHT,
    CAROUSEL_WIDTH,
} from 'v2modules/product/containers/product-details/product-details.container.const';
import { isRTL } from 'dz-I19n';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ProductImagesCarousel = (props) => {
    const {
        isLoading,
        productImage,
        images,
    } = props;


    const SHOULD_REVERSE = useRef(Platform.OS === 'android' && isRTL());
    const carouselRef = useRef(null);
    const [activeSlide, activeSlideSet] = useState(0);
    const [showBlurView, showBlurViewSet] = useState(true);
    const fadeBlur = useRef(new Animated.Value(0)).current;


    const renderItem = useCallback(({item, index}) => {
        const onFirstItemLoaded = () => {
            Animated.timing(fadeBlur,
                {toValue: 1, duration: 500, useNativeDriver: true})
                .start();

            setTimeout(() => {
                showBlurViewSet(false)
            }, 250);
        }

        const onPress = () => {
            if (images?.length > 0) {
                const toIndex = activeSlide >= images.length ? 0 : activeSlide;
                RootNavigation.navigate(MainStackNavsConst.IMAGE_GALLERY, {
                    images: images?.map(image => image.src || image) || [],
                    currentIndex: toIndex
                });
            }
        }


        const imageSrc = item.src || item;
        return (
            <Touchable activeOpacity={1} onPress={onPress}>
                {
                    (!!imageSrc) &&
                    <ImageWithBlur style={style.slideImage}
                                   resizeMode={'cover'}
                                   useFastImage={true}
                                   onLoadEnd={index === 0? onFirstItemLoaded: undefined}
                                   thumbnailUrl={refactorImageUrl(
                                       imageSrc, 1)}
                                   imageUrl={refactorImageUrl(
                                       imageSrc, SCREEN_WIDTH)}
                    />
                }
            </Touchable>
        )
    }, [images, activeSlide])

    const InactiveDot = useCallback(({active, index}) => {
        return (
            <View style={[
                style.dotStyle,
                active && style.activeDot,
                (index !== images.length - 1) && style.dotSpace
            ]}/>

        )
    }, [images]);


    const onSnapToItem = useCallback((index) => {
        activeSlideSet(index);
    }, []);

    const containerStyle = useMemo(() => ({height: CAROUSEL_HEIGHT}), []);

    return (
        <View style={containerStyle}>
            {
                (!isLoading && images?.length > 0) &&
                <>
                    <Carousel
                        ref={carouselRef}
                        data={images}
                        useScrollView={false}
                        firstItem={0}
                        initialScrollIndex={0}
                        renderItem={renderItem}
                        sliderWidth={CAROUSEL_WIDTH}
                        itemWidth={CAROUSEL_WIDTH}
                        inactiveSlideScale={1}
                        containerCustomStyle={style.carouselView}
                        enableSnap={true}
                        onSnapToItem={onSnapToItem}
                        scrollEndDragDebounceValue={100}
                        enableMomentum={true}
                        decelerationRate={0.9}
                    />
                    {
                        (images?.length > 1) &&
                        <Animated.View style={[style.dotsContainer, {opacity: fadeBlur}]}>
                            <Pagination
                                dotsLength={images?.length}
                                containerStyle={[style.dotsView]}
                                activeDotIndex={activeSlide}
                                carouselRef={carouselRef}
                                inactiveDotElement={<InactiveDot/>}
                                dotElement={<InactiveDot/>}
                                inactiveDotScale={1}
                                tappableDots={false}
                            />
                            <Space directions={'h'} size={'lg'} />
                            <Space directions={'h'} size={'lg'} />
                        </Animated.View>
                    }
                </>
            }
            {
                (showBlurView) &&
                <View style={style.blurView}>
                    {
                        (!productImage && !images?.length) &&
                        <ActivityIndicator style={style.loadingView} size="large" color={Colors.CERULEAN_BLUE} />
                    }
                    {
                        (productImage || images?.length > 0) &&
                        <ImageWithBlur style={style.slideImage}
                                       resizeMode={'cover'}
                                       useFastImage={false}
                                       thumbnailUrl={refactorImageUrl(
                                           images?.length > 1 ?
                                               images[SHOULD_REVERSE.current ? images.length - 1 : 0].src :
                                               productImage, 1)}
                                       imageUrl={refactorImageUrl(
                                           images?.length > 1 ?
                                               images[SHOULD_REVERSE.current ? images.length - 1 : 0].src :
                                               productImage, SCREEN_WIDTH)}/>
                    }
                </View>
            }
        </View>
    );
}

export default ProductImagesCarousel;
