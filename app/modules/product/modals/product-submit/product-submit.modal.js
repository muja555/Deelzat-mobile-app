import React from 'react';
import Modal from "react-native-modal";

import { productSubmitModalStyle as style } from './product-submit.modal.style';
import ProductSubmit from "modules/product/components/product-submit/product-submit.component";

const ProductSubmitModal = (props) => {

    const {
        isVisible = false,
        onHide = () => {},
        onPressGoToShop = () => {}
    } = props;

    return (
        <Modal
            onBackButtonPress={() => {}}
            onBackdropPress={() => {}}
            useNativeDriver={true}
            isVisible={isVisible}
            style={style.container}>
            <ProductSubmit onHide={onHide} onPressGoToShop={onPressGoToShop}/>
        </Modal>
    );
};

export default ProductSubmitModal;
