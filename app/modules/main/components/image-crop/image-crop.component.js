import React, {useEffect, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {CropView} from 'react-native-image-crop-tools';
import {imageCropStyle as style} from './image-crop.component.style';
import ImageCropHeader from "modules/main/components/image-crop-header/image-crop-header.component";
import cloneDeep from "lodash/cloneDeep";

const ImageCrop = (props) => {

    const {
        image = {},
        onDone = () => {},
        onCancel = () => {}
    } = props;

    const cropper = useRef(null);

    const [localImage, localImageSet]  = useState('');

    const saveImage = () => {
        cropper.current.saveImage(true, 90);
    };

    const onImageCrop = (payload) => {
        localImage.data.uri = payload.uri;
        onDone(localImage);
    };

    const onRotate = () =>  {
        cropper.current.rotateImage(true);
    };


    useEffect(() => {
        localImageSet(cloneDeep(image));

    }, [image]);

    return (
        <View style={style.container}>
            <ImageCropHeader
                onDone={saveImage}
                onRotate={onRotate}
                onCancel={onCancel}
            />
            <CropView
                ref={cropper}
                sourceUrl={(Platform.OS === 'ios' && !localImage?.data?.uri.includes("file")? "file:" : "") + localImage?.data?.uri}
                style={{flex: 1, backgroundColor: '#000'}}
                onImageCrop={onImageCrop}
            />
        </View>
    );
};

export default ImageCrop;
