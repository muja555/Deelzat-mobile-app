import React, {useCallback, useEffect, useState} from 'react';
import {View, SafeAreaView, Platform, Dimensions} from 'react-native';

import { imageGalleryContainerStyle as style } from './image-gallery.container.style';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {saveImageToGallery} from "modules/main/others/images.utils";
import Toast from "deelzat/toast";
import IconButton from "deelzat/v2-ui/icon-button";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import BackSvg from "assets/icons/BackIcon.svg";
import I19n, {isRTL} from "dz-I19n";
import {LocalizedLayout} from "deelzat/style";
import WillShowToast from "deelzat/toast/will-show-toast";
import {DzText} from "deelzat/v2-ui";
import {refactorImageUrl} from "modules/main/others/main-utils";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

let ImageViewer;
const ImageGalleryContainer = (props) => {
    const {
        images = [],
        currentIndex = 0,
    } = props.route.params;

    const [allImages, allImagesSet] = useState([]);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (images) {
            let mapImages = images
                .filter(image => !!image)
                .map(image => {
                    const newUrl = refactorImageUrl(image);
                    return {url: newUrl};
                });

            if (isRTL()) {
                mapImages = mapImages.reverse();
            }

            allImagesSet(mapImages);
        }
    }, [images]);

    if (!ImageViewer)
        ImageViewer = require('react-native-image-zoom-viewer').default;


    const renderIndicator = useCallback((currIndex) => {
        if (allImages.length <= 1) {
            return (
                <></>
            )
        }

        return (
            <SafeAreaView style={style.indicatorView}>
                <DzText style={style.indicator}>
                    {currIndex}/{allImages.length}
                </DzText>
            </SafeAreaView>
        )
    }, [allImages]);


    const onSave = (imageUrl) => {
        saveImageToGallery(imageUrl)
            .then(() => {
                const icon = require('assets/icons/Gallery.png');
                Toast.success(I19n.t('تم حفظ الصورة'), icon);
            })
            .catch(console.warn)
    }


    const menuContext = {
        saveToLocal: I19n.t('حفظ'),
        cancel: I19n.t('رجوع')
    }

    return (
        <View style={style.container}>
            <WillShowToast id={'gallery'} />
            {
                (allImages.length > 0) &&
                <ImageViewer index={currentIndex >= allImages.length? 0: currentIndex}
                             imageUrls={allImages}
                             renderIndicator={renderIndicator}
                             menuContext={menuContext}
                             menus={({cancel, saveToLocal}) => (
                                 <View style={[style.menuView, Platform.OS === 'ios' && {paddingBottom: 32}]}>
                                     <Button
                                         onPress={saveToLocal}
                                         btnStyle={style.button}
                                         size={ButtonOptions.Size.LG}
                                         type={ButtonOptions.Type.PRIMARY}
                                         text={I19n.t('حفظ')}
                                     />
                                     <Space directions={'h'}/>
                                     <Button
                                         onPress={cancel}
                                         btnStyle={style.button}
                                         size={ButtonOptions.Size.LG}
                                         type={ButtonOptions.Type.MUTED_OUTLINE}
                                         text={I19n.t('رجوع')}
                                     />
                                 </View>
                             )}
                             onSave={onSave}
                />
            }
            <View style={[style.actionBar, {marginTop: insets.top}]}>
                <IconButton onPress={RootNavigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={'#fff'} width={24} height={24}/>
                </IconButton>
            </View>
        </View>
    )
};

export default ImageGalleryContainer;
