import React from 'react';
import Modal from "react-native-modal";

import {imageCropModalStyle as style} from './image-crop.modal.style';
import ImageCrop from "modules/main/components/image-crop/image-crop.component";

const ImageCropModal = (props) => {

    const {
        image = {},
        isVisible = false,
        onHide = () => {},
        onDone = () => {}
    } = props;


    return (
        <Modal
            onBackButtonPress={onHide}
            onBackdropPress={onHide}
            useNativeDriver={true}
            isVisible={isVisible}
            animationOutTiming={1}
            style={style.container}>
            <ImageCrop
                image={image}
                onCancel={onHide}
                onDone={onDone}
            />
        </Modal>
    );
};

export default ImageCropModal;
