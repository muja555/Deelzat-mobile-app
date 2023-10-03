import React from 'react';
import { shopImageEditModalStyle as style } from './shop-image-edit.modal.style';
import Modal from "react-native-modal";
import ShopImageEdit from "modules/shop/components/shop-image-edit/shop-image-edit.component";

const ShopImageEditModal = (props) => {

    const {
        shop = {},
        isVisible = false,
        onHide = () => {},
    } = props;

    return (
        <Modal
            onBackButtonPress={onHide}
            onBackdropPress={onHide}
            useNativeDriver={true}
            isVisible={isVisible}
            style={style.container}>
            <ShopImageEdit
                onHide={onHide}
                shop={shop}
            />

        </Modal>
    );
};

export default ShopImageEditModal;
