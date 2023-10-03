import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Modal from "react-native-modal";

import { actionSheetModalStyle as style } from './action-sheet.modal.style';
import ActionSheet from 'v2modules/shared/components/action-sheet/action-sheet.component';

function ActionSheetModal() {

    this.show = () => {};

    this.Modal = (props) => {

        const {
            children = null,
            message = '',
            actions = [],
            onHide = () => {}
        } = props;

        const [isVisible, isVisibleSet] = useState(false);

        this.show = (show = true, showOptions = {}) => {
            isVisibleSet(show);
        };

        if (!isVisible) {
            return <></>
        }

        return (
            <Modal
                onBackButtonPress={onHide}
                onBackdropPress={onHide}
                useNativeDriver={true}
                isVisible={isVisible}
                animationInTiming={200}
                animationOutTiming={200}
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                style={style.container}>
                <ActionSheet
                    message={message}
                    actions={actions}
                    onHide={onHide}
                >
                    {children}
                </ActionSheet>

            </Modal>
        );
    };
};


const useActionSheetModal = () => {
    return new ActionSheetModal();
};
export default useActionSheetModal;
