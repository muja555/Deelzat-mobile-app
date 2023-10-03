import React, {useEffect, useRef, useState} from 'react'
import {SafeAreaView, TouchableOpacity, View} from 'react-native'
import {chatImagesPickerContainerStyle as style} from "./chat-images-picker.container.style";
import {useDispatch, useSelector} from "react-redux";
import {chatSelectors, chatThunks} from "modules/chat/stores/chat/chat.store";
import uniqueId from 'lodash/uniqueId';
import omit from 'lodash/omit';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import ImageCropModal from "modules/main/modals/image-crop/image-crop.modal";
import {takeImage} from "modules/main/others/images.utils";
import TakePhotoSvg from 'assets/icons/TakePhoto.svg';
import I19n from 'dz-I19n';
import {ButtonOptions} from "deelzat/ui";
import ConfirmService from "modules/main/others/confirm.service";
import {RNCamera} from "react-native-camera";
import ProductImagesEditList
    from "modules/product/components/product-images-edit-list/product-images-edit-list.component";
import ProductImagesEditHeader
    from "modules/product/components/product-images-edit-header/product-images-edit-header.component";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import WillShowToast from "deelzat/toast/will-show-toast";

const ChatImagesPickerContainer = (props) => {

    const {
        roomName,
    } = props.route.params;

    const dispatch = useDispatch();
    const cameraRef = useRef(null);
    const imagesListRef = useRef(null);
    const chatImages = useSelector(chatSelectors.chatImagesSelector)

    const [images, imagesSet] = useState([]);
    const [affectedImage, affectedImageSet] = useState({});
    const [isImageCropModalVisible, isImageCropModalVisibleSet] = useState(false);

    useEffect(() => {
        imagesSet(chatImages);
    }, []);

    const onDone = () => {

        (async() => {

            // get any images was exists and now doesn't
            const removedImages = [];
            chatImages.forEach(_chatImg => {
                if (!images.find(img => img.id === _chatImg.id))
                    removedImages.push(_chatImg)
            })

            for (let i = 0; i < removedImages.length; i++)
                await dispatch(chatThunks.removeImageToSend(removedImages[i]))

            dispatch(chatThunks.uploadImagesForSend(roomName, images))

            onExit()
        })()
    }

    const takePhoto = () => {
        takeImage(cameraRef)
            .then(imageData => {
                const image = {
                    id: uniqueId(['']),
                    uri: imageData.uri,
                    imageSource: 'CAMERA'
                };
                affectedImageSet(image);
                imagesSet([...images, image]);
            })
            .catch(console.warn)
    };

    const onCropImageSelected = (image) => {
        affectedImageSet(image);
        isImageCropModalVisibleSet(true);
    };

    const onRemoveImageSelected = (image) => {
        affectedImageSet(image);
        imagesSet(images.filter((item) => item.id !== image.id));
    };

    const onCropDone = (image) => {
        const tmpImages = cloneDeep(images)
        const imageIndex = findIndex(tmpImages, (item) => item.id === image.id);
        const tmpImage = {...image, uri: image.data.uri}
        tmpImages[imageIndex] = omit(tmpImage, 'base64');
        imagesSet(tmpImages);
        isImageCropModalVisibleSet(false);
        const _affectedImage = images[imageIndex];
        affectedImageSet(_affectedImage);
    };

    const selectImageAction = (image, index) => {

        let actions = [
            {
                label: 'قص الصورة',
                type: ButtonOptions.Type.PRIMARY_OUTLINE,
                callback: () => {
                    onCropImageSelected(image);
                }
            },
            {
                label: 'ازالة الصورة',
                type: ButtonOptions.Type.DANGER_OUTLINE,
                callback: () => {
                    onRemoveImageSelected(image);
                }
            }
        ];

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

    const onExit = () => {
        RootNavigation.goBack();
    }

    return (
        <SafeAreaView style={style.container}>
            <WillShowToast id={'chat-images-picker'}/>
            <ProductImagesEditHeader
                onNext={onDone}
                onCancel={onExit}
                canMoveNext={!!images.length}
                title={I19n.t('التقط صورة')}
                buttonTitle={I19n.t('أرسل')}
            />

            <ImageCropModal
                onHide={() => isImageCropModalVisibleSet(false)}
                onDone={onCropDone}
                isVisible={isImageCropModalVisible}
                image={affectedImage? {...affectedImage, data: {uri: affectedImage.uri}} : affectedImage}/>

            <RNCamera
                ref={cameraRef}
                style={style.camera}
                captureAudio={false}
                orientation={RNCamera.Constants.Orientation.portrait}
                type={RNCamera.Constants.Type.back}
            />

            <View style={style.actionsView}>
                <TouchableOpacity
                    onPress={takePhoto}
                    style={style.takePhotoBtn}>
                    <TakePhotoSvg/>
                </TouchableOpacity>
            </View>

            <View style={style.imagesView}>
                <ProductImagesEditList
                    ref={imagesListRef}
                    onItemPress={selectImageAction}
                    images={images}/>
            </View>
        </SafeAreaView>
    );
};

export default ChatImagesPickerContainer
