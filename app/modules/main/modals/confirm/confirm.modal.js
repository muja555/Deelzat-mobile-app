import React, {useEffect, useState} from 'react';
import {confirmModalStyle as style} from './confirm.modal.style';
import Modal from "react-native-modal";
import Confirm from "modules/main/components/confirm/confirm.component";
import ConfirmService from "modules/main/others/confirm.service";


const ConfirmModal = () => {

    const [isVisible, isVisibleSet] = useState(false);
    const [type, typeSet] = useState(false);
    const [title, titleSet] = useState(false);
    const [message, messageSet] = useState(false);
    const [actions, actionsSet] = useState([])

    const onHide = () => {
        isVisibleSet(false);
    };

    useEffect(() => {

        const onSetVisibleOff = ConfirmService.onSetVisible((options) => {
            isVisibleSet(!!options.show);
            actionsSet(options.actions || []);
            messageSet(options.message || '');
        });

        return () => {
            onSetVisibleOff();
        }
    }, []);


    if(!isVisible) {
        return <></>
    }

    return (
        <Modal
            onBackButtonPress={onHide}
            onBackdropPress={onHide}
            useNativeDriver={true}
            isVisible={isVisible}
            style={style.container}>
            <Confirm
                type={type}
                title={title}
                message={message}
                actions={actions}
                onHide={onHide}
            />
        </Modal>
    );
};

export default ConfirmModal;
