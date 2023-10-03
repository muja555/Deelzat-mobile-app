import React, {useMemo} from 'react';
import {View, ActivityIndicator} from "react-native";
import { style as imageWithBlurStyle } from "./image-with-blur.style";
import {Colors} from "../style";
import FastImage from "@deelzat/react-native-fast-image";
import {NoFlickerImage} from "react-native-no-flicker-image";

const ImageWithBlur = (props) => {

    const {
        thumbnailUrl,
        imageUrl,
        style = {},
        withLoader = true,
        useFastImage = false,
        onLoadEnd,
        ...rest
    } = props;


    const imageSource = useMemo(() => ({uri: imageUrl}), [imageUrl]);
    const thumbSource = useMemo(() => ({uri: thumbnailUrl, priority: FastImage.priority.high}), [thumbnailUrl]);

    if (!imageUrl) {
        return <View style={[imageWithBlurStyle.container, style]} />
    }

    return (
        <View style={[imageWithBlurStyle.container, style]}>
            {
                (withLoader && !thumbnailUrl) &&
                <ActivityIndicator
                    size={'small'}
                    style={style.activityIndicator}
                    color={Colors.MAIN_COLOR}
                />
            }
            {
                (!!thumbnailUrl && thumbnailUrl !== imageUrl) &&
                <FastImage
                    source={thumbSource}
                    style={imageWithBlurStyle.blurView}
                />
            }
            {
                (useFastImage) &&
                <FastImage
                    source={imageSource}
                    style={imageWithBlurStyle.imageStyle}
                    onLoadEnd={onLoadEnd}
                    resizeMode={'stretch'}
                    {...rest}
                />
            }
            {
                (!useFastImage) &&
                <NoFlickerImage
                    source={imageSource}
                    style={imageWithBlurStyle.imageStyle}
                    onLoadEnd={onLoadEnd}
                    resizeMethod="scale"
                    resizeMode="cover"
                />
            }
        </View>
    )
}

export default ImageWithBlur;
