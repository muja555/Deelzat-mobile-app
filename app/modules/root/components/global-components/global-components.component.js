import React, {useState, useRef, useEffect} from 'react';
import { View, Text } from 'react-native';
import { globalComponentsStyle as style } from './global-components.component.style';
import AlertModal from "modules/main/modals/alert/alert.modal";
import ConfirmModal from "modules/main/modals/confirm/confirm.modal"
import GlobalSpinner from "modules/main/components/global-spinner/global-spinner.components";
import WelcomeMarket from "v2modules/geo/components/welcome-market/welcome-market.component";
import BigSplashOverlay from "v2modules/main/components/big-splash-overlay/big-splash-overlay.component";
import useImagePreviewModal from "v2modules/shared/modals/image-preview/image-preview.modal";
import useCouponInaAppMessageModal from 'v2modules/shared/modals/coupon-inapp-message/coupon-inapp-message.modal';
import WillShowToast from 'deelzat/toast/will-show-toast';

const ImagePreviewModal = useImagePreviewModal();
const CouponInAppMessageModal = useCouponInaAppMessageModal();
const GlobalComponents = () => {

    return (
        <View style={style.container}>
            <AlertModal />
            <ConfirmModal/>
            <GlobalSpinner />
            <BigSplashOverlay />
            <WelcomeMarket />
            <CouponInAppMessageModal.Modal />
            <ImagePreviewModal.Modal />
            <WillShowToast id={'main-toast'}/>
        </View>
    );
};

export default GlobalComponents;
