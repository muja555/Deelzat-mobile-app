import React, {useEffect, useState} from 'react';
import {alertModalStyle as style} from './alert.modal.style';
import Modal from "react-native-modal";
import Alert from "modules/main/components/alert/alert.component";
import AlertService from "modules/main/others/alert.service";


const AlertModal = () => {

    const [isVisible, isVisibleSet] = useState(false);
    const [type, typeSet] = useState(false);
    const [title, titleSet] = useState(false);
    const [message, messageSet] = useState(false);

    const onHide = () => {
        isVisibleSet(false);
    };

    useEffect(() => {

        const onSetVisibleOff = AlertService.onSetVisible((options) => {
            typeSet(options.type);
            titleSet(options.title);
            messageSet(options.message);
            isVisibleSet(!!options.show);
        });

        return () => {
            onSetVisibleOff();
        }
    }, []);

    return (
        <Modal
            onBackButtonPress={onHide}
            onBackdropPress={onHide}
            useNativeDriver={true}
            isVisible={isVisible}
            hideModalContentWhileAnimating={true}
            style={style.container}>
            <Alert
                type={type}
                title={title}
                message={message}
                onHide={onHide}
            />
        </Modal>
    );
};

export default AlertModal;
