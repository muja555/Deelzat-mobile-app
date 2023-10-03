import React, {useEffect, useState} from 'react';

import {fillChatNameModalStyle as style} from './fill-chat-name.modal.style';
import Modal from "react-native-modal";

import FillChatNameModalService from "./fill-chat-names.modal.service";
import FillChatName from "modules/chat/components/fill-chat-name/fill-chat-name.component";
import {KeyboardAvoidingView, Platform} from "react-native";

let FillChatNameModalOptions = {};

const FillChatNameModal = () => {

    const [isVisible, isVisibleSet] = useState(false)

    useEffect(() => {
        return FillChatNameModalService.onSetVisible((payload) => {
            FillChatNameModalOptions = payload
            isVisibleSet(true)
        })
    }, [])

    const onHide = () => {
        isVisibleSet(false);
    }

    return (
        <Modal
            onBackButtonPress={onHide}
            useNativeDriver={true}
            isVisible={isVisible}
            hideModalContentWhileAnimating={true}
            style={style.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'none'}>
                <FillChatName
                    onHide={onHide}
                    onChangeSuccess={FillChatNameModalOptions.onChangeName}
                    trackSource={FillChatNameModalOptions.trackSource}/>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default FillChatNameModal;
