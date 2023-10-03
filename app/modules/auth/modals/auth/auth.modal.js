import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {authModalStyle as style} from './auth.modal.style';
import WillShowToast from "deelzat/toast/will-show-toast";
import Auth from "modules/auth/components/auth/auth.component";
import AuthModalService from "./auth.modal.service";
import {trackSignup, trackViewSignupPage} from "modules/analytics/others/analytics.utils";

let AuthModalOptions = {};

const AuthModal = () => {

    const [isVisible, isVisibleSet] = useState(false);

    const onHide = () => {
        if (AuthModalOptions.onHide && typeof AuthModalOptions.onHide === "function") {
            AuthModalOptions.onHide();
        }
        isVisibleSet(false);
    };

    const onAuthSuccess = (loginMethod) => {
        if (AuthModalOptions.onAuthSuccess && typeof AuthModalOptions.onAuthSuccess === "function") {
            AuthModalOptions.onAuthSuccess();
            trackSignup(loginMethod, AuthModalOptions.trackSource)
        }
        isVisibleSet(false);
    }


    useEffect(() => {

        return  AuthModalService.onSetVisible((options) => {
            const _isVisible = !!options.show
            isVisibleSet(_isVisible);
            AuthModalOptions = options;
            if (_isVisible)
                trackViewSignupPage(AuthModalOptions?.trackSource)
        });
    }, []);

    return (
        <Modal
            backdropColor={'white'}
            onBackButtonPress={onHide}
            onBackdropPress={onHide}
            useNativeDriver={true}
            isVisible={isVisible}
            animationInTiming={1}
            animationOutTiming={1}
            style={style.container}>
            <WillShowToast id={'auth-modal-toast'}/>
            <Auth onHide={onHide} onAuthSuccess={onAuthSuccess}/>
        </Modal>
    );
};

export default AuthModal;
