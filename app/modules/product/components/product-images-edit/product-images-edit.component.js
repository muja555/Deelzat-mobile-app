import React, {useState, useRef, useEffect, useCallback} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {RNCamera} from 'react-native-camera';

import TakePhotoSvg from 'assets/icons/TakePhoto.svg';
import GallerySvg from 'assets/icons/Gallery.svg';
import uniqueId from 'lodash/uniqueId';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';

import { productImagesEditStyle as style } from './product-images-edit.component.style';
import ProductImagesEditList from "modules/product/components/product-images-edit-list/product-images-edit-list.component";
import ImageCropModal from "modules/main/modals/image-crop/image-crop.modal";
import ProductImagesEditHeader from "modules/product/components/product-images-edit-header/product-images-edit-header.component";
import {productActions, productSelectors} from "modules/product/stores/product/product.store";
import {useDispatch, useSelector} from "react-redux";
import ProductAddStepConst from "modules/product/constants/product-add-step.const";
import {ButtonOptions} from "deelzat/ui";
import ConfirmService from "modules/main/others/confirm.service";
import {choseFromImageLibrary, takeImage} from "modules/main/others/images.utils";
import {
    trackAddImage,
    trackRemoveImage,
    trackCropImage,
    trackSetImageAsDefault
} from "modules/analytics/others/analytics.utils";
import I19n from "dz-I19n";
import useMidViewModal from "v2modules/shared/modals/mid-view/mid-view.modal";

const ProductImagesEdit = (props) => {

    const {
        onNext = (step) => {},
        onCancel = () => {}
    } = props;

    const dispatch = useDispatch();
    const cameraRef = useRef(null);
    const imagesListRef = useRef(null);
    const productState = useSelector(productSelectors.productStateSelector);

    const [images, imagesSet] = useState([]);
    const [affectedImage, affectedImageSet] = useState({});
    const [isImageCropModalVisible, isImageCropModalVisibleSet] = useState(false);


    const onLocalNext = () => {
        dispatch(productActions.SetData({
            images: images
        }));
        onNext(ProductAddStepConst.EDIT_SUB_CATEGORY);
    };


    const takePhoto = () => {

        takeImage(cameraRef)
            .then(imageData => {
                const image = {
                    id: uniqueId(['']),
                    data: {
                        uri: imageData.uri
                    },
                    imageSource: 'CAMERA'
                };

                affectedImageSet(image);
                trackAddImage(1, image.imageSource)
                const newImages = [
                    ...images,
                    image
                ];
                imagesSet(newImages?.length > 10? newImages.slice(-10): newImages);
            })
            .catch(console.warn)
    };

    const onSetAsMainSelected = (image) => {
        affectedImageSet(image);
        imagesSet([
            image,
            ...images.filter((item) => item.id !== image.id)
        ]);
        trackSetImageAsDefault(image.imageSource)
    };

    const onCropImageSelected = (image) => {
        affectedImageSet(image);
        isImageCropModalVisibleSet(true);
    };

    const onRemoveImageSelected = (image) => {
        trackRemoveImage(images.length - 1)
        affectedImageSet(image);
        imagesSet(images.filter((item) => item.id !== image.id));
    };

    const onCropDone = (image) => {
        const tmpImages = cloneDeep(images);
        const imageIndex = findIndex(tmpImages, (item) => item.id === image.id);
        tmpImages[imageIndex] = image;
        imagesSet(tmpImages);
        isImageCropModalVisibleSet(false);
        const _affectedImage = images[imageIndex];
        affectedImageSet(_affectedImage);
        trackCropImage(_affectedImage.imageSource);
    };


    const openImageLibrary = () => {

        choseFromImageLibrary(true).then(results => {

            const addedImages = results.map(image => {
                return {
                    id: uniqueId(['']),
                    data: { uri: image.path},
                    imageSource: 'GALLERY'
                }
            });

            affectedImageSet(addedImages[addedImages.length - 1]);
            trackAddImage(addedImages.length, 'GALLERY')

            const newImages = [
                ...images,
                ...addedImages
            ];
            imagesSet(newImages?.length > 10? newImages.slice(-10): newImages);

        }).catch(console.warn);
    };

    const selectImageAction = (image, index) => {

        let actions = [];

        if(index !== 0) {
            actions.push({
                label: I19n.t('تعيين كصورة رئيسية'),
                type: ButtonOptions.Type.PRIMARY,
                callback: () => {
                    onSetAsMainSelected(image);
                }
            })
        }


        if (!image.remote) {
            actions.push({
                label: I19n.t('قص الصورة'),
                type: ButtonOptions.Type.PRIMARY_OUTLINE,
                callback: () => {
                    onCropImageSelected(image);
                }
            })
        }

        actions.push({
            label: I19n.t('إزالة الصورة'),
            type: ButtonOptions.Type.DANGER_OUTLINE,
            callback: () => {
                onRemoveImageSelected(image);
            }
        });


        ConfirmService.confirm({
            actions: actions
        })
    };

    useEffect(() => {
        setTimeout(() => {
            const affectedIndex = findIndex(images, (item) => item.id === affectedImage.id);
            if (affectedIndex >  -1 && imagesListRef.current) {
                try {
                    imagesListRef.current.scrollToItem({ animated: true, item: images[affectedIndex]});
                } catch (e) {
                    console.warn(e);
                }
            }
        }, 100)
    }, [images]);

    useEffect(() => {
        imagesSet(productState.images);
    }, [productState.images]);


    return (
        <View style={style.container}>

            <ProductImagesEditHeader
                onNext={onLocalNext}
                onCancel={onCancel}
                canMoveNext={!!images.length}
                title={I19n.t('صور المنتج')}
            />

            <ImageCropModal
                onHide={() => isImageCropModalVisibleSet(false)}
                onDone={onCropDone}
                isVisible={isImageCropModalVisible}
                image={affectedImage}/>

            <RNCamera
                ref={cameraRef}
                style={style.camera}
                captureAudio={false}
                keepAudioSession={false}
                useNativeZoom={true}
                orientation={RNCamera.Constants.Orientation.portrait}
                type={RNCamera.Constants.Type.back}
            />

            <View style={style.actionsView}>

                <View style={style.openGalleryBtn}/>

                <TouchableOpacity
                    onPress={takePhoto}
                    style={style.takePhotoBtn}>
                    <TakePhotoSvg/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={openImageLibrary}
                    style={style.openGalleryBtn}>
                    <View style={style.openGalleryIconView}>
                        <GallerySvg
                            width={30}
                            height={30}
                        />
                    </View>
                </TouchableOpacity>

            </View>

            <View style={style.imagesView}>
                <ProductImagesEditList
                    ref={imagesListRef}
                    onItemPress={selectImageAction}
                    images={images}/>
            </View>
        </View>
    );
};

export default ProductImagesEdit;
