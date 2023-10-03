import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from "react-native-modal";

import { buttonActionModalStyle as style } from './mid-view.modal.style';

let timeoutId;
function MidViewModal() {

    this.show = () => {};

    this.Modal = (props) => {

        const {
            children,
            contentStyle = {},
            enableOnBackDrop = true,
            ...modalProps
        } = props;

        const [isVisible, isVisibleSet] = useState(false);
        const [isMounted, isMountedSet] = useState(false);

        this.show = (show = true, _showOptions = {}) => {
            isVisibleSet(show);
        };

        const onHide = () => {
            isVisibleSet(false);
        };


        useEffect(() => {
            timeoutId = setTimeout(() => {
                isMountedSet(isVisible);
            }, isVisible? 0 : modalProps.animationOutTiming || 300)

            return () => {
                clearTimeout(timeoutId);
            }
        }, [isVisible]);

        if (!isMounted) {
            return <></>
        }

        return (
            <Modal
                onBackButtonPress={enableOnBackDrop? onHide: undefined}
                onBackdropPress={enableOnBackDrop? onHide: undefined}
                animationInTiming={1}
                animationOutTiming={1}
                backdropTransitionInTiming={1}
                backdropTransitionOutTiming={1}
                useNativeDriver={true}
                isVisible={isVisible}
                style={style.container}
                {...modalProps}>
                <View style={[style.content, contentStyle]}>
                    {children}
                </View>
            </Modal>
        );
    };
};


const useMidViewModal = () => {
    return new MidViewModal();
};
export default useMidViewModal;
