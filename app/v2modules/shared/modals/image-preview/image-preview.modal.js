import React, { useCallback, useEffect, useRef, useState } from 'react';
import {View, Text, Animated, Image, Dimensions} from 'react-native';
import Modal from "react-native-modal";

import FastImage from "@deelzat/react-native-fast-image";
import { imagePreviewModalStyle as style } from './image-preview.modal.style';
import ImagePreviewModalService from "./image-preview.modal.service";
import {refactorImageUrl} from "modules/main/others/main-utils";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

function ImagePreviewModal() {

    this.show = () => {};

    this.Modal = () => {

        const [isVisible, isVisibleSet] = useState(false);
        const [imageUrl, imageUrlSet] = useState();
        const [preLoadUrl, preLoadUrlSet] = useState();
        const [asRectangle, asRectangleSet] = useState(false);
        const imageAnim = useRef(new Animated.Value(0)).current;


        useEffect(() => {
            return ImagePreviewModalService.onSetVisible(({show, imageUrl, asRectangle}) => {
                if (imageUrl) {
                    preLoadUrlSet(refactorImageUrl(imageUrl, 1));
                    imageUrlSet(refactorImageUrl(imageUrl, SCREEN_WIDTH));
                    asRectangleSet(asRectangle);
                }

                showModal(show);
            })
        }, []);

        const showModal = (show = true) => {
            isVisibleSet(show);
            if (!show) {
                onHide();
                preLoadUrlSet();
                imageUrlSet();
                asRectangleSet(false);
            }
        };

        const onHide = () => {
            isVisibleSet(false);
            Animated.timing(imageAnim, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true
            }).start();
        };

        const onLoadEnd = useCallback(() => {
            Animated.timing(imageAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            }).start();
        }, []);

        return (
            <Modal
                onBackButtonPress={onHide}
                onBackdropPress={onHide}
                useNativeDriver={true}
                isVisible={isVisible}
                animationInTiming={100}
                animationOutTiming={100}
                backdropTransitionInTiming={100}
                backdropTransitionOutTiming={100}
                animationIn={"fadeIn"}
                animationOut={"fadeOut"}
                style={style.container}>
                <View style={style.content}>
                    {
                        (preLoadUrl) &&
                        <FastImage
                            style={[style.previewImage, asRectangle && {height: SCREEN_HEIGHT * 0.3, width: SCREEN_HEIGHT * 0.3}]}
                            resizeMode="cover"
                            resizeMethod="resize"
                            source={{uri: preLoadUrl, priority: FastImage.priority.high}}/>
                    }
                    {
                        (imageUrl) &&
                        <Animated.View style={[
                            style.previewImage,
                            asRectangle && {height: SCREEN_HEIGHT * 0.3, width: SCREEN_HEIGHT * 0.3},
                            {opacity: imageAnim, position: 'absolute'}
                        ]}>
                            <FastImage
                                style={{width: '100%', height: '100%', borderRadius: 12}}
                                resizeMode="cover"
                                resizeMethod="resize"
                                onLoadEnd={onLoadEnd}
                                source={{uri: imageUrl, priority: FastImage.priority.high}}/>
                        </Animated.View>
                    }
                </View>
            </Modal>
        );
    };
};


const useImagePreviewModal = () => {
    return new ImagePreviewModal();
};
export default useImagePreviewModal;
