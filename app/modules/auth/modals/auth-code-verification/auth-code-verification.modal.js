import React from 'react';
import Modal from 'react-native-modal';
import {authCodeVerificationStyle as style} from './auth-code-verification.modal.style';
import WillShowToast from "deelzat/toast/will-show-toast";
import AuthCodeVerification from "modules/auth/components/auth-code-verification/auth-code-verification.component";

const AuthCodeVerificationModal = (props) => {

    const {
        identifier ='',
        isVisible = false,
        authMethod,
        onHide = () => {},
        onSuccess = (loginMethod) => {}
    } = props;


    return (
        <Modal
            useNativeDriver={true}
            isVisible={isVisible}
            style={style.container}>
            <WillShowToast id={'auth-code-verification-modal-toast'}/>
            <AuthCodeVerification
                onHide={onHide}
                onSuccess={onSuccess}
                identifier={identifier}
                authMethod={authMethod}
            />

        </Modal>
    );
};

export default AuthCodeVerificationModal;
