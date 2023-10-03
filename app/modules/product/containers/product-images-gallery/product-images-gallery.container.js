import React, {useCallback} from 'react'
import {SafeAreaView, TouchableOpacity, View, Text} from 'react-native'
import {productImageGalleryContainerStyle as style} from "./product-images-gallery.container.style";
import BackIcon from "assets/icons/ShadowedArrowRight.svg";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {refactorImageUrl} from "modules/main/others/main-utils";
import {saveImageToGallery} from "modules/main/others/images.utils";
import Toast from "deelzat/toast";
import {DzText} from "deelzat/v2-ui";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

let ImageViewer;
const ProductImagesGalleryContainer = (props) => {
    const {
        images = [],
        currentIndex = 0,
    } = props.route.params

    const insets = useSafeAreaInsets();

    if (!ImageViewer)
        ImageViewer = require('react-native-image-zoom-viewer').default;

    const renderIndicator = useCallback((currIndex, allImages) =>
            <SafeAreaView style={style.actionBar}>
                <DzText style={style.indicator}>
                    {currIndex}/{images.length}
                </DzText>
            </SafeAreaView>
    , [images]);

    const onSave = (imageUrl) => {

        saveImageToGallery(imageUrl)
            .then(() => {
                const icon = require('android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png');
                Toast.success('تم حفظ الصورة إلى الجهاز', icon);
            })
            .catch(console.warn)
    }

    return (
        <View style={style.container}>
            <ImageViewer index={currentIndex}
                         imageUrls={images?.map(image => {
                             return {...image, url: refactorImageUrl(image.src)}
                         })}
                         renderIndicator={renderIndicator}
                         menuContext={{ saveToLocal: 'حفظ', cancel: 'رجوع' }}
                         onSave={onSave}
            />
            <View style={[style.actionBar, {marginTop: insets.top}]}>
                <TouchableOpacity
                    style={style.backBtn}
                    activeOpacity={0.6}
                    hitSlop={{top: 50, bottom: 50, left: 100, right: 100}}
                    onPress={RootNavigation.goBack}>
                    <BackIcon scaleX={1} scaleY={1} width={20} height={40}/>
                </TouchableOpacity>
            </View>
        </View>
    )

}

export default ProductImagesGalleryContainer
