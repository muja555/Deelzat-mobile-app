import React, {useEffect} from 'react';
import Modal from 'react-native-modal';
import { shopEditStyle as style } from './shop-edit.modal.style';
import WillShowToast from "deelzat/toast/will-show-toast";
import ShopEdit from "modules/shop/components/shop-edit/shop-edit.component";
import {trackViewShopEdit, trackExitShopEdit} from "modules/analytics/others/analytics.utils";

const ShopEditModal = (props) => {

    const {
        pageTitle,
        isVisible = false,
        onHide = () => {},
        trackSource,
    } = props;


    useEffect(() => {
        if (isVisible)
            trackViewShopEdit(trackSource)
    }, [isVisible])

    const _onHide = (action, newShopData) => {
        trackExitShopEdit()
        onHide(action, newShopData)
    }

    return (
        <Modal
            useNativeDriver={true}
            isVisible={isVisible}
            hideModalContentWhileAnimating={true}
            style={style.container}>
            <WillShowToast id={'shop-edit-modal-toast'}/>
            <ShopEdit
                onHide={_onHide}
                pageTitle={pageTitle}
                trackSource={trackSource}
            />
        </Modal>
    );
};

export default ShopEditModal;
