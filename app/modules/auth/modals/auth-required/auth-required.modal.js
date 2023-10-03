import React, {useEffect, useState} from 'react';

import {authRequiredModalStyle as style} from './auth-required.modal.style';
import Modal from "react-native-modal";
import AuthRequired from "modules/auth/components/auth-required/auth-required.component";
import AuthModal from "modules/auth/modals/auth/auth.modal";
import AuthRequiredModalService from "./auth-required.modal.service";

let AuthRequiredModalOptions = {};

const AuthRequiredModal = () => {

    const [isVisible, isVisibleSet] = useState(false)

    useEffect(() => {
        return AuthRequiredModalService.onSetVisible((payload) => {
            AuthRequiredModalOptions = payload;
            isVisibleSet(!!payload);
        })
    }, [])

    const onHide = () => {
        isVisibleSet(false);
    }

    return (
        <Modal
            onBackButtonPress={onHide}
            onBackdropPress={onHide}
            useNativeDriver={true}
            isVisible={isVisible}
            hideModalContentWhileAnimating={true}
            style={style.container}>
            <AuthModal/>
            {
                (!!AuthRequiredModalOptions) &&
                <AuthRequired
                    onHide={onHide}
                    onAuthSuccess={AuthRequiredModalOptions.onAuthSuccess}
                    message={AuthRequiredModalOptions.message}
                    trackSource={AuthRequiredModalOptions.trackSource}
                />
            }
        </Modal>
    );
};

export default AuthRequiredModal;
